'use strict';
const assert=require('node:assert/strict');
const bgm=require('../public/js/bgm.js');
assert.equal(bgm.cityTrack({region:'동북아시아',countryCode:'JP'}),'city_japan');
assert.equal(bgm.cityTrack({region:'동북아시아',countryCode:'CN'}),'city_china');
assert.equal(bgm.cityTrack({region:'동북아시아',countryCode:'KR'}),'city_china');
assert.equal(bgm.cityTrack({region:'동남아시아',countryCode:'VN'}),'city_southeast_asia');
assert.equal(bgm.cityTrack({region:'인도',countryCode:'IN'}),'city_india');
assert.equal(bgm.cityTrack({region:'서아프리카',countryCode:'GH'}),'city_africa');
assert.equal(bgm.cityTrack({region:'북아프리카',countryCode:'EG'}),'city_middle_east');
assert.equal(bgm.cityTrack({region:'북유럽',countryCode:'NO'}),'city_scandinavia');
assert.equal(bgm.cityTrack({region:'이탈리아',countryCode:'IT'}),'city_mediterranean');
assert.equal(bgm.cityTrack({region:'중앙아메리카',countryCode:'MX'}),'city_america');
// V72부터 바다 곡은 현대식 대양 구분이 아니라 원작에서 그 곡을 쓰던 자리를 따른다.
assert.equal(bgm.seaTrack({lat:70,lon:20}),'sailing_polar');
assert.equal(bgm.seaTrack({lat:36,lon:15}),'sailing_near_europe');
assert.equal(bgm.seaTrack({lat:55,lon:3}),'sailing_near_europe');
assert.equal(bgm.seaTrack({lat:-15,lon:75}),'sailing_indian_ocean');
assert.equal(bgm.seaTrack({lat:-20,lon:130}),'sailing_pacific');
assert.equal(bgm.seaTrack({lat:8,lon:-75}),'sailing_pacific');
assert.equal(bgm.seaTrack({lat:0,lon:-20}),'sailing_atlantic');
// 서태평양·북대서양 같은 넓은 원양은 인도양 곡이 맡는다.
assert.equal(bgm.seaTrack({lat:20,lon:150}),'sailing_indian_ocean');
assert.equal(bgm.seaTrack({lat:25,lon:-45}),'sailing_indian_ocean');
assert.equal(bgm.resolveTrack({joined:false}),'voyage_preparation');
assert.equal(bgm.resolveTrack({joined:true,waitingForStart:true,mode:'sea',position:{lat:20,lon:-45}}),'voyage_preparation');
assert.equal(bgm.resolveTrack({joined:true,mode:'land'}),'land_expedition');
console.log('v65 BGM routing ok');
