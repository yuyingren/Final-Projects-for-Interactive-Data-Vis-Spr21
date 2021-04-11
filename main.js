/**
 * CONSTANTS AND GLOBALS
 * */
 const width = window.innerWidth * 0.9,
 height = window.innerHeight * 0.7,
 margin = { top: 20, bottom: 50, left: 60, right: 40 };

let svg;
let tooltip;
let tooltip1;

let state = {
 // + INITIALIZE STATE
 data: null,
 hover:null,
};




/**
* LOAD DATA
* */
/*d3.json("../data/flare.json", d3.autotype).then(data => {
 state.data = data;
 init();
});*/


