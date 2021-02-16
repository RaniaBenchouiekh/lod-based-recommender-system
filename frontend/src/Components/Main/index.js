import React from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import BooksRecommender from '../BooksRecommender';
import MoviesRecommender from '../MoviesRecommender';

export default class Main extends React.Component {

    render() {
        return (
                <Router>
                    <Switch>
                        <Route path="/BooksRecommender" exact component={BooksRecommender} />
                        <Route path="/MoviesRecommender" exact component={MoviesRecommender} />
                    </Switch>
                </Router>
            );
    } 
}