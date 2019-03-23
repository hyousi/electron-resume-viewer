import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import App  from './page/App';

export class MainRouter extends React.Component {
    render () {
        return (
            <HashRouter>
                <Switch>
                    <Route exact path={'/'} component={App} />
                </Switch>
            </HashRouter>
        )
    }
}