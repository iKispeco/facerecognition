import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/navigation';
import Logo from './components/Logo/logo';
import ImageLinkForm from './components/ImageLinkForm/imageLinkForm';
import Rank from './components/Rank/rank';
import FaceRecognition from './components/FaceRecognition/faceRecognition';
import SignIn from './components/SignIn/signIn';
import Register from './components/Register/register';
import './App.css';

const particleOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 700
      }
    }
  }
}
const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      } 
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState( {user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }});
  }
 

  onInputChange = (event) => {
      this.setState({input: event.target.value});
  }  

  calculateFaceLocation = (data) => {
    const faceLocation = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('imageinput');
    const height = Number(image.height);
    const width = Number(image.width);
    return {
      leftCol: faceLocation.left_col * width,
      topRow: faceLocation.top_row * height,
      rightCol: width - (faceLocation.right_col * width),
      bottomRow: height - (faceLocation.bottom_row * height)
    }
  }

  faceBox = (box) => {
    this.setState({box: box});
  } 

  onSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch('https://vast-tor-15746.herokuapp.com/imageurl', {
         method: 'post',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
          input: this.state.input
          })
        })
      .then(response => response.json())
      .then(response => {
        if (response) { 
          fetch('https://vast-tor-15746.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
            .catch(console.log)
        }
      this.faceBox(this.calculateFaceLocation(response))
    })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'home') {
      this.setState({isSignedIn: true})
    } 
    else if (route === 'signin') {
      this.setState(initialState)
    }
    this.setState({route: route});
  }

  
  render() {
    const {isSignedIn, box, imageUrl, route} = this.state;
    return (
      <div className="App">
         <Particles className='particle'
          params={particleOptions} />
        <Navigation isSignedIn={isSignedIn} signOut={this.onRouteChange} />
        { route === 'home' 
        ? <div>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries} />
          <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onSubmit={this.onSubmit} />
          <FaceRecognition faceBox={box} imageUrl={imageUrl}/>
        </div>
        : ( route === 'signin' 
          ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }     
      </div>
    );
  }
}

export default App;
