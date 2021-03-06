wifi.start()
wifi.mode(wifi.STATION)
wifi.sta.disconnect()

local json_file_to_dict = require('json').json_file_to_dict -- Magic
config = json_file_to_dict('config.json')

cfg = {ssid=config.wifi.ssid, pwd=config.wifi.pwd, hidden=1} -- set config values for the scan

print("Networks:")
wifi.sta.scan(cfg, function(err, succ)
    if err then
        print("Scan failed: ", err)
    else
        print(string.format("%-26s", "SSID"), "Channel BSSID            RSSI Auth Bandwidth")
        for i, AP in ipairs(succ) do
            print(string.format("%-32s",AP.ssid), AP.channel, AP.bssid, AP.auth,AP.bandwidth)
    end
    print("Total APs: ", #succ) 
end
end)