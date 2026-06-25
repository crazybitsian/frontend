/* eslint-disable @typescript-eslint/no-require-imports */
const https = require('https'); 
https.get('https://unsplash.com/photos/street-view-of-charminar-a-historic-landmark-4udpJFBYhcA', {headers: {'User-Agent': 'Mozilla/5.0'}}, (res) => { 
  let d = ''; 
  res.on('data', c => d+=c); 
  res.on('end', () => { 
    const matches = d.match(/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+/g) || [];
    console.log([...new Set(matches)].slice(0, 5));
  }); 
});
