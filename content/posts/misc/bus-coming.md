---
title: "某实时公交API"
date: 2020-03-07T00:00:00+08:00
categories: ["misc"]
---


* API  

```php
<?php

class BusComing {

    /** Construct
     * @date 2022/03/20
     * 
     * @param string $userId
     * @param string $h5Id
     */
    public function __construct(string $userId = '', string $h5Id = '') {
        $this->userId = $userId;
        // the h5Id default userId
        $this->h5Id = empty($h5Id) ? $userId : $h5Id;
        // user agent
        $this->userAgent = 'Mozilla/5.0 (Linux; Android 10; MI 6 Build/PKQ1.190118.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/88.0.0000.00 XWEB/3193 MMWEBSDK/20220202 Mobile Safari/537.36 MMWEBID/5374 MicroMessenger/8.0.20.2100(0x28001437) Process/appbrand1 WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64 MiniProgramEnv/android';
    }

    /** Set user agent
     * 
     * @param string $userAgent
     */
    public function setUserAgent(string $userAgent = '') {
        $this->userAgent = $userAgent;
    }

    /** cURL request
     * 
     * @param string $url
     * @param array $header
     * @param string $userAgent
     * @param string $proxy
     * 
     * @return string
     */
    private static function curl(string $url = '', array $header = [], string $userAgent = '', string $proxy = ''): string {
        // parse header
        $header = array_map(function ($key, $value) { return $key . ':' . $value; }, array_keys($header), $header);
        // curl
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE); 
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE); 
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $header);
        curl_setopt($curl, CURLOPT_PROXY, $proxy);
        curl_setopt($curl, CURLOPT_USERAGENT, $userAgent);
        curl_setopt($curl, CURLOPT_ENCODING, 'gzip,deflate');
        $output = curl_exec($curl);
        curl_close($curl);
        return $output;
    }

    /** Search buses/lines detail
     * 
     * @param array $param
     * @param string $proxy
     * 
     * @return array
     */
    public function searchLines(array $param = [], $proxy = ''): array {
        $preset = [
            's' => 'h5',
            'wxs' => 'wx_app',
            'sign' => '1',
            'h5RealData' => '1',
            'v' => '4.0.00',
            'src' => 'weixinapp_cx',
            'ctm_mp' => 'mp_wx',
            'vc' => '1',
            'cityId' => '040',             // not 020 in canton, so strange
            'favoriteGray' => '0',
            'userId' => $this->userId,
            'h5Id' => $this->h5Id,
            'lat' => '23.123603',          // latitude
            'lng' => '113.384541',         // longitude
            'geo_lat' => '23.123603',      // geo latitude => lat
            'geo_lng' => '113.384541',     // geo longitude => lng
            'gpstype' => 'wgs',
            'geo_type' => 'wgs',
            'scene' => '1006',
            'localCityId' => '040',        // not 020 in canton, so strange
            'key' => '28',
            'poiNum' => '0',
        ];
        // merge params
        $param = array_merge($preset, $param);
        // parse params
        $param = array_map(function ($key, $value) { return $key . '=' . $value; }, array_keys($param), $param);
        $url = 'https://web.chelaile.net.cn/api/bus/query!nSearch.action?' . implode('&', $param);
        $header = [
            'Connection' => 'keep-alive',
            'charset' => 'utf-8',
            'content-type' => 'text',
            'Accept-Encoding' => 'gzip,compress,br,deflate',
            'Referer' => 'https://servicewechat.com/wx71d589ea01ce3321/543/page-frame.html',
        ];
        $string = self::curl($url, $header, $this->userAgent, $proxy);
        // example **YGJK{}YGJK##
        $json = json_decode(substr(substr($string, 6), 0, -6), true) ?? ['jsonr' => ['data' => ['result' => []], 'status' => '00']];
        return $json['jsonr']['data']['result'];
    }

    /** Get line detail
     * 
     * @param array $param
     * @param string $proxy
     * 
     * @return array
     */
    public function getLineDetail(array $param = [], $proxy = ''): array {
        $preset = [
            's' => 'h5',
            'wxs' => 'wx_app',
            'sign' => '1',
            'h5RealData' => '1',
            'v' => '4.0.00',               // version
            'src' => 'weixinapp_cx',
            'ctm_mp' => 'mp_wx',
            'vc' => '1',
            'cityId' => '040',             // not 020 in canton, so strange
            'favoriteGray' => '0',
            'userId' => $this->userId,
            'h5Id' => $this->h5Id,
            'lat' => '23.123603',          // latitude
            'lng' => '113.384541',         // longitude
            'geo_lat' => '23.123603',      // geo latitude => lat
            'geo_lng' => '113.384541',     // geo longitude => lng
            'gpstype' => 'wgs',
            'geo_type' => 'wgs',
            'scene' => '1001',
            'lineId' => '020-00280-1',     // cityId-lineId-order(forward: 0/backward: 1)
            'targetOrder' => '1',          // station order
            'special' => '0',
            'specialOrder' => '1',         // station order
            'specialType' => 'undefined',
            'specialTargetOrder' => '1',   // station order
            'stationId' => '020-18462',    // bus station id
            'grey_city' => '1',
            'localCityId' => '040',        // not 020 in canton, so strange
            'permission' => '0',
            'cryptoSign' => 'd4f6d9ba4bd88dc8c8070de0aeb72e74',
        ];
        // merge params
        $param = array_merge($preset, $param);
        // parse params
        $param = array_map(function ($key, $value) { return $key . '=' . $value; }, array_keys($param), $param);
        $url = 'https://web.chelaile.net.cn/api/bus/line!encryptedLineDetail.action?' . implode('&', $param);
        $header = [
            'Connection' => 'keep-alive',
            'charset' => 'utf-8',
            'content-type' => 'text',
            'Accept-Encoding' => 'gzip,compress,br,deflate',
            'Referer' => 'https://servicewechat.com/wx71d589ea01ce3321/543/page-frame.html',
        ];
        $string = self::curl($url, $header, $this->userAgent, $proxy);
        // example **YGJK{}YGJK##
        $json = json_decode(substr(substr($string, 6), 0, -6), true) ?? ['jsonr' => ['data' => ['encryptResult' => ''], 'status' => '00']];
        $data = $json['jsonr']['data'];
        // mode and key take from fetcher.encrypt.js in wechat mini app
        $string = openssl_decrypt($data['encryptResult'], 'aes-256-ecb', 'FF32AE65FBFD19414EAAFF6291A54B42');
        return json_decode($string, true) ?? [];
    }
    
    /** Get buses detail
     * 
     * @param array $param
     * @param string $proxy
     * 
     * @return array
     */
    public function getBusesDetail(array $param = [], $proxy = ''): array {
        $preset = [
            's' => 'h5',
            'wxs' => 'wx_app',
            'sign' => '1',
            'h5RealData' => '1',
            'v' => '4.0.00',               // version
            'src' => 'weixinapp_cx',
            'ctm_mp' => 'mp_wx',
            'vc' => '1',
            'cityId' => '040',             // not 020 in canton, so strange
            'favoriteGray' => '0',
            'userId' => $this->userId,
            'h5Id' => $this->h5Id,
            'lat' => '23.123603',          // latitude
            'lng' => '113.384541',         // longitude
            'geo_lat' => '23.123603',      // geo latitude => lat
            'geo_lng' => '113.384541',     // geo longitude => lng
            'gpstype' => 'wgs',
            'geo_type' => 'wgs',
            'scene' => '1001',
            'lineId' => '020-00280-1',     // cityId-lineId-order(forward: 0/backward: 1)
            'targetOrder' => '1',
            'specialTargetOrder' => '1',
            'specail' => '0',
            'stationId' => '020-4608',     // bus station id
            'specialType' => 'undefined',
            'cshow' => 'busDetail',
        ];
        // merge params
        $param = array_merge($preset, $param);
        // parse params
        $param = array_map(function ($key, $value) { return $key . '=' . $value; }, array_keys($param), $param);
        $url = 'https://web.chelaile.net.cn/api/bus/line!busesDetail.action?' . implode('&', $param);
        $header = [
            'Connection' => 'keep-alive',
            'charset' => 'utf-8',
            'content-type' => 'text',
            'Accept-Encoding' => 'gzip,compress,br,deflate',
            'Referer' => 'https://servicewechat.com/wx71d589ea01ce3321/543/page-frame.html',
        ];
        $string = self::curl($url, $header, $this->userAgent, $proxy);
        // example **YGJK{}YGJK##
        $json = json_decode(substr(substr($string, 6), 0, -6), true) ?? ['jsonr' => ['data' => [], 'status' => '00']];
        return $json['jsonr']['data'];
    }
}
```

* 使用  

```php
echo "<pre>";
$bus = new BusComing('okBHq0ETXAjgKH5HcIltsNaV3Lsk');
echo "result of buses/lines: <br/>";
// lines 线路信息
print_r($bus->searchLines());
echo "line detail: <br/>";
// stations 站点信息
print_r($bus->getLineDetail());
echo "bus detail: <br/>";
// buses 公交信息
print_r($bus->getBusesDetail());
echo "</pre>";
```

* [PHP](https://www.php.net)依赖
> [cURL](https://www.php.net/manual/en/book.curl.php)模块
> [OpenSSL](https://www.php.net/manual/en/book.openssl.php)模块
