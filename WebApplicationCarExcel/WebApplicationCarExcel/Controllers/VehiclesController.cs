using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using WebApplicationApiGrafica.Models;
using Microsoft.VisualBasic.FileIO;
using System.Globalization;
using System.Text;

namespace WebApplicationCarExcel.Controllers
{
    [Route("api/Vehicles")]
    [ApiController]
    public class VehiclesController : Controller
    {
        private IWebHostEnvironment _hostingEnvironment;

        public VehiclesController(IWebHostEnvironment environment)
        {
            _hostingEnvironment = environment;
        }

        [HttpPost]
        [Route("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            var uploads = Path.Combine(_hostingEnvironment.ContentRootPath, "uploads");
            if (!Directory.Exists(uploads))
            {
                Directory.CreateDirectory(uploads);
            }

            if (file.Length > 0)
            {
                var filePath = Path.Combine(uploads, file.FileName);                
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath); ;
                }
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
            }
            return Ok();
        }

        [HttpGet]       
        public async Task<IActionResult> getFile(string fileName)
        {
            var result = new List<Vehicle>();

            var uploads = Path.Combine(_hostingEnvironment.ContentRootPath, "uploads");
            if (Directory.Exists(uploads))
            {
                var provider = _hostingEnvironment.ContentRootFileProvider;
                var fullname = uploads + "\\" + fileName;
              
                result = await Task.Run(() => ParseFileToList(fullname));
            }
            else
            {
                Directory.CreateDirectory(uploads);
            }
            return Ok(result);
        }

        private List<Vehicle> ParseFileToList(string name)
        {
            List<Vehicle> list = new List<Vehicle>();
            
            TextFieldParser parser = new TextFieldParser(name, Encoding.GetEncoding(28591)); 
            parser.TextFieldType = FieldType.Delimited;
            parser.SetDelimiters(",");
            var r = 0;
            CultureInfo culture = new CultureInfo("en-US");

            while (!parser.EndOfData)
            {
                r++;               
                string[] fields = parser.ReadFields();
                if (r == 1)
                    continue;
                list.Add(new Vehicle
                {
                    DealNumber = Convert.ToInt32(fields[0]),
                    CustomerName = fields[1],
                    DealershipName = fields[2],
                    VehicleName = fields[3],
                    Price = fields[4],
                    Date = Convert.ToDateTime(fields[5], culture) 
            });
            }
            return list;
        }

    }
}
