import React, { Component } from 'react';
import request from 'superagent';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { deepOrange500 } from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

const styles = {
	container: {
	}
};

const muiTheme = getMuiTheme({
	palette: {
		accent1Color: deepOrange500,
	},
});

const apiHost = process.env.REACT_APP_API_HOST || 'localhost:3001';

function me(host, opts) {
  const { size, offset, token } = Object.assign({}, { size: 10, offset: 0 }, opts);

  return request.get(`${host}/`)
    .query({ size, offset, t: token });
}

function addPost(host, title, content, opts) {
  const { size, offset, token } = Object.assign({}, { size: 10, offset: 0 }, opts);

  return request.post(`${host}/add-post`)
    .query({ size, offset, t: token })
    .send({ title, content });
}

function removePost(host, id, opts) {
  const { size, offset, token } = Object.assign({}, { size: 10, offset: 0 }, opts);

  return request.post(`${host}/remove-post`)
    .query({ size, offset, t: token })
    .send({ id });
}

// b46cec3943dff224075c4ec98274213a46fbce588eac0e31cd06eb91ba8452fa
class App extends Component {
  constructor(props) {
		super(props);
		this.state = {
			host: `http://${apiHost}`,
      session: null,
      token: null,
      title: '',
      content: '',
      size: 10,
      offset: 0,
      posts: {
        total: 0,
        items: []
      }
		};
	}

  componentDidMount() {
    this.update();
  }

  update(nextOffset) {
    const { size, token } = this.state;
    const offset = Number.isFinite(nextOffset) ? nextOffset : this.state.offset;

    me(this.state.host, { size, offset, token }).then(({ body }) => {
      if (body.success) {
        const { _id: session, token, posts } = body.response;
        this.setState({ session, token, posts, offset });
      }
    }).catch((err) => console.error(err.stack));
  }

  addPost(title, content) {
    const { host, size, offset, token } = this.state;

    addPost(host, title, content, { token, size, offset }).then(({ body }) => {
      if (body.success) {
        const { posts } = body.response;
        this.setState({ posts, title: '', content: '' });
      }
    }).catch((err) => console.error(err.stack));
  }

  removePost(id) {
    const { host, size, offset, token } = this.state;

    removePost(host, id, { size, offset, token }).then(({ body }) => {
      if (body.success) {
        const { posts } = body.response;
        this.setState({ posts, title: '', content: '' });
      }
    }).catch((err) => console.error(err.stack));
  }

  render() {
    const nextVisible = this.state.posts.total > (this.state.offset + this.state.size);
    const prevVisible = this.state.offset > 0;

    return (
			<MuiThemeProvider muiTheme={muiTheme}>
				<div style={styles.container}>
          <Paper zDepth={1}>
            <AppBar title="Message Board" showMenuIconButton={false} />
            <Card>
              <CardHeader title="Credentials" />
              <CardText>
                <TextField
                  fullWidth={true}
                  floatingLabelText="Token"
                  value={this.state.token || ''}
                  onChange={(_, token) => this.setState({ token })} />
              </CardText>
              <CardActions>
                <FlatButton label="Update"
                  primary={true}
                  onTouchTap={() => this.update()} />
              </CardActions>
            </Card>
            <Card>
              <CardHeader title="New post" />
              <CardText>
              <TextField
                fullWidth={true}
                floatingLabelText="Title"
                value={this.state.title}
                onChange={(_, title) => this.setState({ title })} />
              <TextField
                fullWidth={true}
                floatingLabelText="Content"
                multiLine={true}
                rows={2}
                rowsMax={20}
                value={this.state.content}
                onChange={(_, content) => this.setState({ content })} />
              </CardText>
              <CardActions>
                <FlatButton label="Send"
                  primary={true}
                  onTouchTap={() => this.addPost(this.state.title, this.state.content)} />
              </CardActions>
            </Card>
            <Card>
              <CardActions>
              { prevVisible ? <RaisedButton
                label="<< Previous"
                onTouchTap={() => this.update(this.state.offset - this.state.size)} /> : null }
              { nextVisible ? <RaisedButton
                label="Next >>"
                onTouchTap={() => this.update(this.state.offset + this.state.size)} /> : null }
              </CardActions>
            </Card>
            {this.state.posts.items.map(({ _id, title, content, session }, index) => (
            <Card key={index}>
              <CardHeader title={title} />
              <CardText>{content}</CardText>
              { session === this.state.session ? (
                <CardActions>
                  <FlatButton label="Delete" secondary={true} onTouchTap={() => this.removePost(_id)} />
                </CardActions>
              ) : null }
            </Card>
            ))}
          </Paper>
				</div>
			</MuiThemeProvider>
    );
  }
}

export default App;
