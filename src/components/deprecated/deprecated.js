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