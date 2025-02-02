Earth
Landsat imagery is provided to the public as a joint project between NASA and USGS. A recent industry report on landsat satellite imagery data estimates that total annual value to the economy of $2.19 billion, far exceeding the multi-year total cost of building, launching, and managing Landsat satellites and sensors. The value is derived from consumers use of the data. The objective of this endpoint is to give you an easy to use taste of what Landsat imagery data can provide. There are more complicated APIs available if you want to build models on top of satellite imagery, apply machine-learning, or minimize clouds in your image. NASA's Earth Science Devision has a variety of Earth imagery APIs for developers, which you can find out about in the Earthdata Developer Portal. Specifically, the GIBS (Global Imagery Browse Services) API may be of interest. The Google Earth Engine API is another powerful option. This API is powered by Google Earth Engine API, and currently only supports pan-sharpened Landsat 8 imagery.

This example image shows downtown Houston, Texas USA. It should be what is returned if you use the example query below. If you discover any cool applications, please let us know.

Imagery
This endpoint retrieves the Landsat 8 image for the supplied location and date. The response will include the date and URL to the image that is closest to the supplied date. The requested resource may not be available for the exact date in the request. You can retrieve a JSON that contains the inputs you provided and a URL to the resulting image through the assets endpoint. The assets endpoint no longer returns a list of potential images within your date range due to a change on the Google Earth Engine API side.

The cloud score was an optional calculation that returns the percentage of the queried image that is covered by clouds, but it is not available in current versions of the API. If False If HTTP Request

GET https://api.nasa.gov/planetary/earth/imagery

Query Parameters
Parameter Type Default Description
lat float n/a Latitude
lon float n/a Longitude
dim float 0.025 width and height of image in degrees
date YYYY-MM-DD today date of image; if not supplied, then the most recent image (i.e., closest to today) is returned
cloud_score bool False [NOT CURRENTLY AVAILABLE!!!!] calculate the percentage of the image covered by clouds
api_key string DEMO_KEY api.nasa.gov key for expanded usage
Example query
https://api.nasa.gov/planetary/earth/imagery?lon=100.75&lat=1.5&date=2014-02-01&api_key=DEMO_KEY

Note that the returned object may not match the supplied date exactly. Instead, the image closest to the supplied date is returned.
Assets
This endpoint retrieves the date-times and asset names for closest available imagery for a supplied location and date. The satellite passes over each point on earth roughly once every sixteen days. This is an amazing visualization of the acquisition pattern for Landsat 8 imagery. The objective of this endpoint is primarily to support the use of the imagery endpoint.

HTTP Request
GET https://api.nasa.gov/planetary/earth/assets

Query Parameters
Parameter Type Default Description
lat float n/a Latitude
lon float n/a Longitude
date YYYY-MM-DD n/a beginning of 30 day date range that will be used to look for closest image to that date
dim float 0.025 width and height of image in degrees
api_key string DEMO_KEY api.nasa.gov key for expanded usage
Example query
https://api.nasa.gov/planetary/earth/assets?lon=-95.33&lat=29.78&date=2018-01-01&&dim=0.10&api_key=DEMO_KEY
