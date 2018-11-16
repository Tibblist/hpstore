class Items extends React.Component {
    render () {
        var itemArray = createItemArray();
        return (
            <div className="item-container">
            {itemArray.map(function(item, id) {
                var columnNum = counter % 3;
                var column = "item" + columnNum;
                counter++;
                if (id == itemArray.length - 1) {
                    counter = 0;
                }
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

class AccountOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            data: [] 
        };
        this.fetchData = this.fetchData.bind(this);
        this.testSendOrder = this.testSendOrder.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        request
        .get("/api/getOrders")
        .end((err, res) => {
            if (res == null) {
                console.log(res);
                console.log(err);
                return;
            }
            this.setState({
                data: res.body
            });
        });
    }

    testSendOrder() {
        request
            .post('/api/createOrder')
            .set('Content-Type', 'application/json')
            .send(prepData(120, "Naglfar", 1200000000, "10/20/18", "10/27/18", "", 1))
            .then(
                this.fetchData()
                );
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
            <Paper className={classes.root}>
            <Table className={classes.table}>
            <TableHead>
            <TableRow>
            <TableCell>Transaction ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell >Price</TableCell>
            <TableCell >Order Date</TableCell>
            <TableCell >Expected End Date</TableCell>
            <TableCell >Delivered Date</TableCell>
            <TableCell >Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.data.map(n => {
            return (
            <TableRow key={n.id}>
                <TableCell component="th" scope="row" numeric>
                    {n.transID}
                </TableCell>
                <TableCell >{n.name}</TableCell>
                <TableCell >{numberWithCommas(n.price)} ISK</TableCell>
                <TableCell >{n.startDate}</TableCell>
                <TableCell >{n.expectedDate}</TableCell>
                <TableCell >{n.deliveredDate}</TableCell>
                {showStatus(n.status)}
            </TableRow>
             );
             })}
            </TableBody>
            </Table>
        </Paper>
        <button style={{marginLeft: '50%', marginRight: '50%'}} onClick={this.testSendOrder}>Add an order</button>
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

//OLD FETCHDATA FOR ORDERS
fetchData = () => {
    request
    .get("/api/getOrders")  
    .end((err, res) => {
        if (res == null) {
            console.log(err);
            return;
        }
        var newData = [];
        for (var i = 0; i < res.body.length; i++) {
            var keys = Object.keys(res.body[i]);
            var temp = [];
            keys.forEach(function(key){
                if (key === "status") {
                    temp.push(showStatus(res.body[i][key]));
                    //temp.push("Hello");
                    return;
                } else if (key === "price") {
                    temp.push(numberWithCommas(res.body[i][key]) + " ISK");
                    return;
                }
                temp.push(res.body[i][key]);
            });
            newData.push(temp);
        }
        console.log(newData);
        this.setState({
            data: newData
        });
    });
}

function testSendOrder() {
    request
        .post('/api/createOrder')
        .set('Content-Type', 'application/json')
        .send(prepData(120, "Naglfar", 1200000000, "10/20/18", "10/27/18", "", 1))
        .then(
            this.fetchData()
        );
}

/*<MenuItem className={classes.menuItem} value={"1DQ1-A - 1-st Thetastar of Dickbutt"}>
<em>1DQ1-A - 1-st Thetastar of Dickbutt</em>
</MenuItem>
<MenuItem className={classes.menuItem} value={"J5A-IX - The Player of Games"}>J5A-IX - The Player of Games</MenuItem>
<MenuItem className={classes.menuItem} value={"D-W7F0 - #% Gaarastar %#"}>D-W7F0 - #% Gaarastar %#</MenuItem>
<MenuItem className={classes.menuItem} value={"F-NXLQ - Babylon 5-Bil"}>F-NXLQ - Babylon 5-Bil</MenuItem>
<MenuItem className={classes.menuItem} value={"B17O-R - Onii-chan League Headquarters"}>B17O-R - Onii-chan League Headquarters</MenuItem>*/