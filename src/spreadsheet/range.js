(function(f, define){
    define([ "../kendo.core" ], f);
})(function(){

(function(kendo) {
    var RangeRef = kendo.spreadsheet.RangeRef;
    var UnionRef = kendo.spreadsheet.UnionRef;
    var CellRef = kendo.spreadsheet.CellRef;

    var Range = kendo.Class.extend({
        init: function(ref, sheet) {
            this._sheet = sheet;
            this._ref = ref;
        },
        _property: function(list, value, recalc) {
            if (value !== undefined) {
                this._ref.forEach(function(ref) {
                    ref = ref.toRangeRef();

                    for (var ci = ref.topLeft.col; ci <= ref.bottomRight.col; ci++) {
                        var start = this._sheet._grid.index(ref.topLeft.row, ci);
                        var end = this._sheet._grid.index(ref.bottomRight.row, ci);

                        list.value(start, end, value);
                    }
                }.bind(this));

                this._sheet.triggerChange(recalc);

                return this;
            } else {
                var index = this._sheet._grid.cellRefIndex(this._ref.toRangeRef().topLeft);
                return list.value(index, index);
            }
        },
        _styleProperty: function(name, value) {
            var style = this._style();

            if (style === null) {
                style = {};
            }

            if (value !== undefined) {

                if (value === null) {
                    delete style[name];
                } else {
                    style[name] = value;
                }

                this._style(style);

                return this;
            }

            return style[name];

        },
        value: function(value, parse) {
            var type = null;

            if (value !== undefined) {
                var ref = this._ref.toRangeRef().topLeft;
                var result = this._sheet._parse(ref.row, ref.col, value, parse);

                this._sheet.batch(function() {
                    this._property(this._sheet._types, result.type);
                    this._property(this._sheet._values, result.value);
                }.bind(this), true);

                return this;
            } else {
                var type = this._property(this._sheet._types);
                value = this._property(this._sheet._values);

                if (type === "date") {
                    value = kendo.spreadsheet.calc.runtime.serialToDate(value);
                }

                return value;
            }
        },
        type: function() {
            return this._property(this._sheet._types);
        },
        fontColor: function(value) {
            return this._styleProperty("fontColor", value);
        },
        fontFamily: function(value) {
            return this._styleProperty("fontFamily", value);
        },
        fontLine: function(value) {
            return this._styleProperty("fontLine", value);
        },
        fontSize: function(value) {
            return this._styleProperty("fontSize", value);
        },
        fontStyle: function(value) {
            return this._styleProperty("fontStyle", value);
        },
        fontWeight: function(value) {
            return this._styleProperty("fontWeight", value);
        },
        borderLeftColor: function(value) {
            this._ref.relative(0, -1).forEach(function(ref) {
                new Range(ref, this._sheet).borderRightColor(value);
            }.bind(this));
            return this._styleProperty("borderLeftColor", value);
        },
        borderRightColor: function(value) {
            return this._styleProperty("borderRightColor", value);
        },
        horizontalAlignment: function(value) {
            return this._styleProperty("horizontalAlignment", value);
        },
        verticalAlignment: function(value) {
            return this._styleProperty("verticalAlignment", value);
        },
        background: function(value) {
            return this._styleProperty("background", value);
        },
        wrap: function(value) {
            return this._styleProperty("wrap", value);
        },
        _style: function(value) {
            if (value !== undefined) {
                value = JSON.stringify(value);

                if (value === "{}") {
                    value = null;
                }

                return this._property(this._sheet._styles, value);
            }

            return JSON.parse(this._property(this._sheet._styles, value));
        },

        format: function(value) {
            return this._property(this._sheet._formats, value);
        },

        formula: function(value) {
            if (value === null) {

                var sheet = this._sheet;
                sheet.batch(function() {
                    this._property(this._sheet._formulas, null);
                    this.value(null);
                }.bind(this), true);

                return this;
            }

            return this._property(this._sheet._formulas, value, true);
        },

        merge: function() {
            var sheet = this._sheet;
            var mergedCells = sheet._mergedCells;

            sheet.batch(function() {
                this._ref = this._ref.map(function(ref) {
                    if (ref instanceof kendo.spreadsheet.CellRef) {
                        return ref;
                    }

                    var currentRef = ref.toRangeRef().union(mergedCells, function(ref) {
                        mergedCells.splice(mergedCells.indexOf(ref), 1);
                    });

                    var range = new Range(currentRef, sheet);
                    var value = range.value();
                    var background = range.background();

                    range.value(null);
                    range.background(null);

                    var topLeft = new Range(currentRef.collapse(), sheet);

                    topLeft.value(value);
                    topLeft.background(background);

                    mergedCells.push(currentRef);
                    return currentRef;
                });
            }.bind(this));

            return this;
        },

        unmerge: function() {
            var mergedCells = this._sheet._mergedCells;

            this._ref.forEach(function(ref) {
                ref.intersecting(mergedCells).forEach(function(mergedRef) {
                    mergedCells.splice(mergedCells.indexOf(mergedRef), 1);
                });
            });

            this._sheet.triggerChange();

            return this;
        },

        select: function() {
            this._sheet.select(this._ref);

            return this;
        },

        values: function(values) {
            if (this._ref instanceof UnionRef) {
                throw new Error("Unsupported for multiple ranges.");
            }

            var result = this._sheet.values(this._ref.toRangeRef(), values);

            if (values === undefined) {
                return result;
            }

            return this;
        },

        clear: function(options) {

            var clearAll = !options || !Object.keys(options).length;

            var sheet = this._sheet;

            sheet.batch(function() {

                if (clearAll || (options && options.contentsOnly === true)) {
                    this.formula(null);
                }

                if (clearAll || (options && options.formatOnly === true)) {

                    this._style(null);
                    this.format(null);
                    this.unmerge();
                }

            }.bind(this));

            return this;
        },

        clearContent: function() {
            return this.clear({ contentsOnly: true });
        },

        clearFormat: function() {
            return this.clear({ formatOnly: true });
        },

        sort: function(spec) {
            if (this._ref instanceof UnionRef) {
                throw new Error("Unsupported for multiple ranges.");
            }

            var ref = this._ref.toRangeRef();
            var columns = spec instanceof Array ? spec : [spec];
            var sortedIndices = null;

            columns.forEach(function(column) {
                var ascending = true;

                if (typeof column === "object") {
                    ascending = column.ascending !== false;
                    column = column.column;
                }

                if (typeof column === "number") {
                    ref = ref.toColumn(column);
                }

                sortedIndices = this._sheet._sort(ref, ascending, sortedIndices);
            }, this);

            this._sheet.triggerChange(true);

            return this;
        }
    });

    kendo.spreadsheet.Range = Range;
})(kendo);

}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });
