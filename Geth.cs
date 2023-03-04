using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;
using System.Net;
using System.Numerics;

namespace Geth
{
    public class ToGeth
    {
	// EthDenver 2023 Scroll Bounty candidate
        // Server class to send funds when Captcha is successfully submitted.
	// Using the Scroll TestNet L1
	// Captcha Crater calls Razd Services which in turn make calls to this class.

	// Assumes a Geth Ethernet Node is running on the same machine.

        // geth --datadir ./data --networkid 534351 --http
        // personal.unlockAccount("<sender address>")

        public static string chainID = "534351";



        public static string callGeth(string command, object parms)
        {
            object message = new
            {
                jsonrpc = "2.0",
                method = command,
                @params = parms,
                id = 1
            };
            string json = JsonSerializer.Serialize(message);
            WebClient client = new WebClient();
            client.Headers.Add("Content-Type", "application/json");
            string url = "http://localhost:8545";
            string reply = client.UploadString(url, json);
            return reply;
        }


        public static string callGeth(string command)
        {
            string json = "{ \"jsonrpc\":\"2.0\",\"method\":\"" + command + "\",\"params\":[],\"id\":1}";
            WebClient client = new WebClient();
            client.Headers.Add("Content-Type", "application/json");
            string url = "http://localhost:8545";
            string reply = client.UploadString(url, json);
            return reply;
        }

        public static string getBalance(string address)
        {
            string command = "eth_getBalance";
            var parms = new object[] { address, "latest" };
            string reply = callGeth(command, parms);
            JSONObject job = new JSONObject(reply);
            string result = job.GetField("result").ToString();
            return result;
        }

        public static string getNonce(string fromAddress)
        {
            var parms = new object[] { fromAddress, "latest" };
            string reply = callGeth("eth_getTransactionCount", parms);
            JSONObject job = new JSONObject(reply);
            string result = job.GetField("result").ToString();
            var nonce = Convert.ToInt64(result.ToString(), 16);
            return nonce.ToString();
        }
        public static string sendFunds(string sender, string recipient, string amount)
        {
            string gasPriceHex = getGasPrice();
            string gasPrice = BigInteger.Parse(gasPriceHex.Remove(0, 2), System.Globalization.NumberStyles.HexNumber).ToString();
            var amountInWei = (long)(double.Parse(amount) * 1e18);
            string gasRequired = ((long)Math.Ceiling((decimal)amountInWei / 21000)).ToString();
            string nonce = ToGeth.getNonce(sender);

            object parms = new
            {
                from = sender,
                to = recipient,
                value = amount,
                gas = gasRequired,
                gasPrice = gasPrice,
                chainID = chainID,
                nonce = nonce
            };

            return "Ok";
        }

        public static string getGasPrice()
        {
            string gasPriceHex = callGeth("eth_gasprice");
            return gasPriceHex;
        }

        public static string getVersion()
        {
            return callGeth("net_version");
        }

        public static string getAccounts()
        {
            return callGeth("eth_accounts");
        }
    }
    }
