using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using TekTrackingCore.Framework.Types;

namespace TekTrackingCore.Services
{

    public class JSONWebService
    {
        public HttpClient _client;
        public JsonSerializerOptions _serializerOptions;
        public IHttpsClientHandlerService _httpsClientHandlerService;


        public string Token { get; set; }
        public JSONWebService()
        {
            Token = Preferences.Get(AppConstants.TOKEN_KEY, "");
        }
        public JSONWebService(IHttpsClientHandlerService service)
        {
#if DEBUG
            _httpsClientHandlerService = service;
            HttpMessageHandler handler = _httpsClientHandlerService.GetPlatformMessageHandler();
            if (handler != null)
                _client = new HttpClient(handler);
            else
                _client = new HttpClient();
#else
            _client = new HttpClient();
#endif
            _serializerOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true,
                IncludeFields = true
            };

            Token = Preferences.Get(AppConstants.TOKEN_KEY, "");
            _client.DefaultRequestHeaders.Add("Authorization", Token);
        }

        public async Task<string> GetJSONAsync(String url, int timeout)
        {
            
                Uri uri = new Uri(string.Format(url));

                HttpClient client = new HttpClient();
                

            try
            {
                if (Token != null && Token !="")
                {
                    client.DefaultRequestHeaders.Add("Authorization", Token);
                    HttpResponseMessage response = await client.GetAsync(uri);
                    if (response.IsSuccessStatusCode)
                    {
                        string resultjson = await response.Content.ReadAsStringAsync();

                        return resultjson;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return "";
            }
                return "";

            }
        
    }
}
