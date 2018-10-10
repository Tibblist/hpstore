import React from 'react';
import '../../css/store.css';
var counter = 0;
export default class Store extends React.Component {
    render() {
        return (
            <div>
                This is the store.
                <Items></Items>
            </div>
        );
    }
}

class Items extends React.Component {
    render () {
        return (
            <div className="item-container">
            {createItemArray().map(function(item, id) {
                var column = "item" + counter;
                counter++;
                if (counter == 3) { //Updates the column the item will be put on from 0-2
                    counter = 0;
                }
                return <li className={column} key={id}><div className="item">
                <div className="item-image"><img src={item[3]} alt={item[1]}></img></div>
                <div className="item-name">{item[1]}</div>
                <div className="item-price">{item[2]}</div>
                </div></li>
            })}
            </div>
        );
    }
}

function createItemArray() {
    var itemArray = [];
    for (var i = 0; i < 10; i++) {
        var item = [i, "Naglfar", "1.2B", "https://wiki.eveuniversity.org/images/thumb/f/f9/Naglfar.jpg/256px-Naglfar.jpg"];
        itemArray.push(item);
    }
    return itemArray;
}