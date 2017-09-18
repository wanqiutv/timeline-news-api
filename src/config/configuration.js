import fs from 'fs';
import development from './development.js'
import production from './production.js'
export var config = development;
if(process.env.production){
    config = production;
}