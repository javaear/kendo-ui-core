using System;
using System.Collections.Generic;
using Kendo.Mvc.Extensions;

namespace Kendo.Mvc.UI.Fluent
{
    /// <summary>
    /// Defines the fluent API for configuring ChartValueAxisNotesIconBorderSettings
    /// </summary>
    public partial class ChartValueAxisNotesIconBorderSettingsBuilder
        
    {
        /// <summary>
        /// The border color of the icon.
        /// </summary>
        /// <param name="value">The value for Color</param>
        public ChartValueAxisNotesIconBorderSettingsBuilder Color(string value)
        {
            Container.Color = value;
            return this;
        }

        /// <summary>
        /// The border width of the icon.
        /// </summary>
        /// <param name="value">The value for Width</param>
        public ChartValueAxisNotesIconBorderSettingsBuilder Width(double value)
        {
            Container.Width = value;
            return this;
        }

    }
}
