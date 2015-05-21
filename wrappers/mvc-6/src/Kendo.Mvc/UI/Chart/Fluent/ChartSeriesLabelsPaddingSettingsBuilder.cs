using System;
using System.Collections.Generic;

namespace Kendo.Mvc.UI.Fluent
{
    /// <summary>
    /// Defines the fluent API for configuring ChartSeriesLabelsPaddingSettings
    /// </summary>
    public partial class ChartSeriesLabelsPaddingSettingsBuilder
        
    {
        public ChartSeriesLabelsPaddingSettingsBuilder(ChartSeriesLabelsPaddingSettings container)
        {
            Container = container;
        }

        protected ChartSeriesLabelsPaddingSettings Container
        {
            get;
            private set;
        }

        // Place custom settings here
    }
}
