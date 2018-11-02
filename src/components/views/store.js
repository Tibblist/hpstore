import React from 'react';
import StoreHeader from './store-header';
import ItemGrid from '../utils/item-grid';
import { DropDownButton } from '../utils/buttons';
import '../../css/store.css';
import { AuthService } from '../../backend/client/auth';
const request = require('superagent');

export default class Store extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      itemArray: [],
    }
    this.fetchData = this.fetchData.bind(this);
    console.log("Constructor ran");
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    console.log("Fetching data");
    request
        .get("/api/getItems")
        .set('Authorization', AuthService.getToken())
        .end((err, res) => {
            if (err) {
                console.log(err);
                this.setState({
                    itemArray: [{id: '0', name: 'Error getting items', price: 0}]
                }); 
                return;
            }
            var newSuggestions = [];
            for (var i = 0; i < res.body.length; i++) {
              newSuggestions.push({label: res.body[i].name});
            }
            console.log(newSuggestions);
            this.setState({
                itemArray: res.body,
                suggestions: newSuggestions
            });
        })
  }

    render() {
        return (
            <div>
                <StoreHeader suggestions={this.state.suggestions}></StoreHeader>
                <ItemGrid items={this.state.itemArray}></ItemGrid>
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
