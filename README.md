# kenney-crawler
Extract useful information from [kenney.nl](https://kenney.nl/)

# Kenney
> **Free game assets, no strings attached.**

> We've created over 40,000 images, audio files and 3D models for you to use in your projects. Thanks to our public domain license you're even allowed to use them in commercial projects!
Kenney is an open initiative to distribute free game assets.

Check the [donation page](https://kenney.itch.io/kenney-donation)

## Functions

<dl>
<dt><a href="#extractSearch">extractSearch(config)</a> ⇒ <code>Promise</code></dt>
<dd><p>Returns search data</p>
</dd>
<dt><a href="#extractAsset">extractAsset(config)</a> ⇒ <code>Promise</code></dt>
<dd><p>Returns data about specific asset</p>
</dd>
</dl>

<a name="extractSearch"></a>

## extractSearch(config) ⇒ <code>Promise</code>
Returns search data

**Kind**: global function  
**Returns**: <code>Promise</code> - Promise object represents the result of the crawling  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | Config object |
| config.page | <code>number</code> | Page number |
| config.query | <code>string</code> | Query criteria |
| config.category | <code>string</code> | Category id ('2d', '3d', etc) |

<a name="extractAsset"></a>

## extractAsset(config) ⇒ <code>Promise</code>
Returns data about specific asset

**Kind**: global function  
**Returns**: <code>Promise</code> - Promise object represents the result of the crawling  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | Config object |
| config.assetId | <code>string</code> | Like the last section of `https://kenney.nl/assets/platformer-kit` |

