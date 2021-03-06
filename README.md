# Frontend Data

![design](https://i.imgur.com/a4vntCt.jpg)

### [Live version](https://stanbankras.github.io/frontend-data/)

## Description

During the functional programming course @CMDA-TT, the goal is to write code that cleans data with functional patterns. One of the most important things however is to describe the used patterns and show my understanding and progress in the subject.

During the Tech Track, I will be working on a data research for De Volkskrant about parking in Dutch cities.

## Research question
**Do cities provide extra infrastructure and facilities on parking spots in environment zones to promote (more) green transportation?**

Subquestions:

* Are parkingspots closer to public transport to continue your travel this way?

_My expectation:_ environmental zones generally are in more crowded areas, so there's a good chance public transport is near.

* Do parkingspots generally have more charging points for electrical cars?

_My expectation:_ environmental zones should promote green transportation, so I expect more charging points in environmental zones on average.

* Are parkingspot in environment zones with more charging points more expensive to park?

_My expectation:_ I expect the cost of parking to be higher if there are more charging points installed, because of extra expenses. If the contrary is true, this would be very good since it would support green transportation even more.

[Data I expect to use to answer the questions can be found here](https://github.com/StanBankras/functional-programming/wiki/Concept#data-i-expect-to-use)

## What I do with invalid or undefined values in data
If there's an invalid of undefined value in a data point, it will stay in the array of items because it is part of the dataset. Wherever averages are created using this data, undefined or invalid items will be counted as 0 or false, and will still be counted in the average.

The only criteria my data has is that there has to be a geographical location attached, those that don't have this are not used in my visualisation or calculation at all.


## Most interesting functions
* Getting tariff data per parking area: [click here](https://github.com/StanBankras/functional-programming/wiki/Parking-tariffs)
* Combining all data from 4 datapoints: [click here](https://github.com/StanBankras/functional-programming/wiki/Main-function-to-merge-all-data)

## Installation
Here's how to start using this project.
### Prerequisites
* NodeJS 
* NPM/Yarn
* Nodemon

### Install
1. Clone this repository
```git
git clone git@github.com:StanBankras/frontend-data.git
```
2. Install packages
```
npm install
// or
yarn install
```
3. Run the project in a terminal
```
npm run serve
// or 
yarn serve
```

## Acknowledgements
* [TimonWeb](https://timonweb.com/javascript/how-to-enable-es6-imports-in-nodejs/) for setting up my Node development environment where I could use ES6 functionality
* [StackOverflow](https://stackoverflow.com/) for small & quick bug fixes
* [Makeshiftinsights for creating a map in Vue + D3](https://makeshiftinsights.com/blog/d3-vue-choropleth/)
* [webuildinternet for geojson data of NL](https://www.webuildinternet.com/articles/2015-07-19-geojson-data-of-the-netherlands/)
* Laurens Aarnoudse for helping me find the API associated with geojson data about Dutch environmental zones
* [Kris Foster first view on D3 with a barchart](https://www.youtube.com/watch?v=BDpBAFvdjYo)
* [Roli Dori for publishing Vue to Github Pages](https://medium.com/@Roli_Dori/deploy-vue-cli-3-project-to-github-pages-ebeda0705fbd)

## License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
