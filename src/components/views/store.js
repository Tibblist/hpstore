import React from 'react';
import StoreHeader from './store-header';
import ItemGrid from '../utils/item-grid';
import { DropDownButton } from '../utils/buttons';
import '../../css/store.css';

export default class Store extends React.Component {
    render() {
        return (
            <div>
                <StoreHeader></StoreHeader>
                <ItemGrid></ItemGrid>
                <SideMenu></SideMenu>
            </div>
        );
    }
}

class SideMenu extends React.Component {
    constructor(props){
        super(props)
        this.toggleSelected = this.toggleSelected.bind(this);
        this.state = {
          capitals: [
            {
                id: 0,
                title: 'All',
                selected: false,
                key: 'capitals'
            },
            {
              id: 1,
              title: 'Amarr',
              selected: false,
              key: 'capitals'
            },
            {
              id: 2,
              title: 'Caldari',
              selected: false,
              key: 'capitals'
            },
            {
              id: 3,
              title: 'Gallente',
              selected: false,
              key: 'capitals'
            },
            {
              id: 4,
              title: 'Minmatar',
              selected: false,
              key: 'capitals'
            },
            {
              id: 5,
              title: 'Faction',
              selected: false,
              key: 'capitals'
            }
          ],
          supercapitals: [
            {
                id: 0,
                title: 'All',
                selected: false,
                key: 'supercapitals'
            },
            {
              id: 1,
              title: 'Amarr',
              selected: false,
              key: 'supercapitals'
            },
            {
              id: 2,
              title: 'Caldari',
              selected: false,
              key: 'supercapitals'
            },
            {
              id: 3,
              title: 'Gallente',
              selected: false,
              key: 'supercapitals'
            },
            {
              id: 4,
              title: 'Minmatar',
              selected: false,
              key: 'supercapitals'
            },
            {
              id: 5,
              title: 'Faction',
              selected: false,
              key: 'supercapitals'
            }
          ],
          fullfits: [
            {
                id: 0,
                title: 'All',
                selected: false,
                key: 'fullfits'
            },
            {
              id: 1,
              title: 'Amarr',
              selected: false,
              key: 'fullfits'
            },
            {
              id: 2,
              title: 'Caldari',
              selected: false,
              key: 'fullfits'
            },
            {
              id: 3,
              title: 'Gallente',
              selected: false,
              key: 'fullfits'
            },
            {
              id: 4,
              title: 'Minmatar',
              selected: false,
              key: 'fullfits'
            },
            {
              id: 5,
              title: 'Faction',
              selected: false,
              key: 'fullfits'
            }
          ],
        }
    }

    toggleSelected(id, key){
        console.log(id, key);
        let temp = this.state[key]
        temp[id].selected = !temp[id].selected
        this.setState({
          [key]: temp
        })
    }
    
    render() {
        return (
            <div className="sidenav">
                <ul>
                    <DropDownButton
                        titleHelper="Capitals"
                        title="Capitals"
                        list={this.state.capitals}
                        toggleItem={this.toggleSelected}
                    />
                    <DropDownButton
                        titleHelper="Supercapitals"
                        title="Supercapitals"
                        list={this.state.supercapitals}
                        toggleItem={this.toggleSelected}
                    />
                </ul>
            </div>
        );
    }
}
