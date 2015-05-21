﻿using Kendo.Mvc.UI;
using Kendo.Mvc.Extensions;
using Microsoft.AspNet.Mvc;

namespace Kendo.Mvc.Examples.Controllers
{
    public partial class GridController : Controller
    {        
        public ActionResult Column_Menu()
        {
            return View();
        }

        public ActionResult ColumnMenu_Read([DataSourceRequest] DataSourceRequest request)
        {
            return Json(GetOrders().ToDataSourceResult(request));
        }
    }
}