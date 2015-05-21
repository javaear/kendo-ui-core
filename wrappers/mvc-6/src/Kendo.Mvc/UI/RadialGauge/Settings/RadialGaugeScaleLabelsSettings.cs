using Kendo.Mvc.Extensions;
using Microsoft.AspNet.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Kendo.Mvc.UI
{
    /// <summary>
    /// Kendo UI RadialGaugeScaleLabelsSettings class
    /// </summary>
    public partial class RadialGaugeScaleLabelsSettings 
    {
        /// <summary>
        /// Gets or sets the label opacity.
        /// </summary>
        /// <value>
        /// The label opacity.
        /// </value>
        public double? Opacity
        {
            get;
            set;
        }

        public Dictionary<string, object> Serialize()
        {
            var settings = SerializeSettings();

            if (Opacity.HasValue)
            {
                settings["opacity"] = Opacity;
            }

            return settings;
        }
    }
}
