import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination,Button,Icon, Card,Menu,Label,Dropdown, Checkbox, Accordion, Form, Segment, Table } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            pageNumbers: [],
            jobsPerPage: 2,
            totalJobs: 0,
            lastPageNum:0,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.pageNumbering = this.pageNumbering.bind(this);
        this.paginate = this.paginate.bind(this);
        this.leftPaginate = this.leftPaginate.bind(this);
        this.rightPaginate = this.rightPaginate.bind(this);
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
     //  loaderData.isLoading = false;
      //  this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
       // this.loadData(() =>
       //     this.setState({ loaderData })
      //  )
        
        //  console.log(this.state.loaderData)
        this.loadData();
        loaderData.isLoading = false;
        this.setState({ loaderData });

    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        
        var link = 'https://talentappservicestalent.azurewebsites.net/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        // your ajax call and other logic goes here
        console.log(cookies)
        $.ajax({

            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            data: {
                activePage: this.state.activePage,
                sortbyDate: "desc",
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired
            },
            dataType: "json",
            success: function (res) {
               
                if (res.success == true) {
                    this.setState({ loadJobs: res.myJobs })
                    this.setState({ totalJobs: res.myJobs.length })
                    this.pageNumbering(this.state.totalJobs)
                }
                
               
            }.bind(this),
            error: function (res) {
                console.log("error")
            }.bind(this)


        })

      
    }

    pageNumbering (totalJobs ) {
        let i;
        let num = [];
        for (i = 1; i <= Math.ceil(totalJobs / this.state.jobsPerPage); i++) {

            num.push(i);
        }
        this.setState({ pageNumbers: num })
        this.setState({ lastPageNum: i - 1 })

    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }
    paginate(pageNum) {
        this.setState({ activePage: pageNum });
    }
    leftPaginate () {
        if (this.state.activePage > 1) { this.setState({ activePage: this.state.activePage - 1 }) }
    }
    rightPaginate() {
        if (this.state.activePage < this.state.lastPageNum) {
            this.setState({ activePage: this.state.activePage + 1 })
        }
    }

    render() {
        const { loadJobs, jobsPerPage, activePage, pageNumbers } = this.state;
        const indexOfLastPost = activePage * jobsPerPage;
        const indexofFirstPost = indexOfLastPost - jobsPerPage;
        const currentPost = loadJobs.slice(indexofFirstPost, indexOfLastPost);

    
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container ">
                     
                           <h3>List of Jobs</h3>
                      
                    <Icon name='filter' /><label>Filter:</label>
                    <select defaultValue='0'>
                        <option value={0}>Choose filter</option>
                        <option>other</option>
                    </select>
                    <Icon name='calendar alternate' /><label>Sort by date:</label>
                    <select defaultValue='0'>
                        <option value={0}>Newest first</option>
                        <option>Oldest first</option>
                    </select>
                    <br></br>
                    <br></br>
                    
                    <Table basic='very'>
                        <Table.Body>
                            <Table.Row>
                    <Card.Group>
                                    {currentPost.map(job => (
                              <Table.Cell>
                            <Card key={job.id}>
                                <Card.Content>
                                    <Card.Header>{job.title}</Card.Header>
                                    <Label as='a' color='black' ribbon='right'>
                                        <Icon className="user" />
                                        0
                                    </Label>
                                    <Card.Meta>{job.location.city},{job.location.country}</Card.Meta>
                                    <Card.Description>
                                        {job.summary}
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <div className='ui three buttons'>
                                        <Button basic color='blue'>
                                            <i aria-hidden="true" className="ban" />
                                            Close
                                            
                                        </Button>
                                        <Button basic color='blue'>
                                            <i aria-hidden="true" className="edit  icon" />
                                            Edit
                                        </Button>
                                        <Button basic color='blue'>
                                            <i aria-hidden="true" className="copy outline" />
                                            Copy
                                        </Button>
                                    </div>
                                </Card.Content>
                                    </Card>
                                   </Table.Cell>
                            ))}
                                </Card.Group>
                            </Table.Row>
                       
                            </Table.Body>
                        <Table.Footer>
                            <Table.Row>
                                <Table.HeaderCell>
                    <Menu floated='right' >
                        <Menu.Item as='a' icon onClick={() => this.leftPaginate()}>
                            <Icon name='chevron left' />
                        </Menu.Item>

                        {pageNumbers.map(number =>
                        (<Menu.Item key={number} as='a' onClick={() => this.paginate(number)}>{number}</Menu.Item>
                        ))}

                        <Menu.Item as='a' icon onClick={() => this.rightPaginate()}>
                            <Icon name='chevron right' />
                        </Menu.Item>
                                    </Menu>
                                    
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                        </Table>
                    </div>
            </BodyWrapper>
        )
    }
}