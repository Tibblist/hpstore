import React from 'react';
import StoreHeader from './store-header';
import '../../css/store.css';
var counter = 0;
export default class Store extends React.Component {
    render() {
        return (
            <div>
                <StoreHeader></StoreHeader>
                <Items></Items>
                <SideMenu></SideMenu>
            </div>
        );
    }
}

class Items extends React.Component {
    render () {
        return (
            <div className="item-container">
            {createItemArray().map(function(item, id) {
                console.log(id);
                console.log(item);
                var columnNum = counter % 3;
                var column = "item" + columnNum;
                counter++;
                return <p className={column} key={id}><div className="item">
                <div className="item-image"><img src={item[3]} alt={item[1]}></img></div>
                <div className="item-name">{item[1]}</div>
                <div className="item-price">{item[2]}</div>
                </div></p>
            })}
            </div>
        );
    }
}

class SideMenu extends React.Component {
    render() {
        return (
            <div className="sidenav">
                <ul>
                    <div>Capitals</div>
                    <div>Supercapitals</div>
                    <div>Full Fits</div>
                </ul>
            </div>
        );
    }
}

function createItemArray() {
    var itemArray = [];
    for (var i = 0; i < 10; i++) {
        var item = [i, "naglfar", "1.2B", "https://wiki.eveuniversity.org/images/thumb/f/f9/Naglfar.jpg/256px-Naglfar.jpg"];
        itemArray.push(item);
    }
    return itemArray;
}