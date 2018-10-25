/*global swal*/

import React, { Component } from 'react';
import logo from './logo.svg';
import loading from './loading.svg';
import './App.css';
import Sound from 'react-sound';
import Button from './Button';

const apiToken = 'BQB-Z-Thzbg3get-H63Mf48PpoLiCdF-tjhvsZ3e7Rq1Lu2P6u5ePRCdZgi6Ly_dOid_KxSRZaLmIL-vBVaMcdg6jCBDRLvIu_B-vEJwbfViXhhJ28xJvieHnAh6tEs16nKA9xXjDr4_RqCazFZNueT2';

function shuffleArray(array) {
  let counter = array.length;

  while (counter > 0) {
    let index = getRandomNumber(counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

/* Return a random number between 0 included and x excluded */
function getRandomNumber(x) {
  return Math.floor(Math.random() * x);
}

class AlbumCover extends Component {
  render() {
    console.log(this.props.track)
    return(
      <div>
        <img src={this.props.track.album.images[1].url} alt ="albumcover" />
      </div>
    )
  }
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      text : "",
      songsLoaded : "",
      tracks : "",
      currentTrack: "",
      currentTrack_i: 0,
      restart: true,
      timeoutId: ""
    }
  }

  timer() {
    console.log('this ran')
    const letimer =  setTimeout(() => {
      let i = getRandomNumber(this.state.tracks.length)
      this.setState({currentTrack_i: i, currentTrack:this.state.tracks[i]})
    },5000)

    return(letimer)
  }

  componentDidMount() {
    this.setState({
      text : "Bonjour"
    })

    fetch('https://api.spotify.com/v1/me/tracks', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + apiToken,
      },
    })
    .then(response => response.json())
    .then((data) => {
      console.log("Réponse reçue ! Voilà ce que j'ai reçu : ", data);
      let i = getRandomNumber(data.items.length)
      let letimer = this.timer()
      console.log('voici le timer : ', letimer)
      this.setState({
        songsLoaded   : true,
        tracks        : data.items,
        currentTrackId: i,
        currentTrack  : data.items[i],
        timeoutId : this.timer()
      })
    })
  }

  checkAnswer(trackProposed, trackAnswer){
    if(trackProposed.id == trackAnswer.id){
      swal('Bravo', 'C\'est la bonne réponse', 'success')
      .then(() => {
        let i = getRandomNumber(this.state.tracks.length)
        this.setState({currentTrackId : i, currentTrack: this.state.tracks[i]})
        })
      .then(() => {
        console.log('updateattend', this.state.timeoutId)
        clearTimeout(this.state.timeoutId)
      })
      .then(() => {
        this.setState({timeoutId: this.timer()})
      })
    } else {
      swal('Faux', 'Essaie encore...', 'error')
    }
  }

  render() {
    if (!this.state.songsLoaded){
      return (
        <div className="App">
            <img src={loading} className="App-images" alt="images"/>
        </div>
      );
    } else {
      const i = this.state.currentTrackId
      let j
      let k
      do {
        j = getRandomNumber(this.state.tracks.length)
        k = getRandomNumber(this.state.tracks.length)
      }
      while (j == i || k == i || j == k)

      let track1 = this.state.tracks[i].track
      let track2 = this.state.tracks[j].track
      let track3 = this.state.tracks[k].track

      let trackArray = shuffleArray([track1, track2, track3])

      return (

        <div className="App">
          <Sound url={this.state.currentTrack.track.preview_url} playStatus = {Sound.status.PLAYING}/>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h1 className="App-title">Bienvenue sur le Blindtest</h1>
          </header>
          <div className="App-images">
            <p>{this.state.text} World</p>
            <p> Il y a {this.state.tracks.length} chansons dans la playlist. </p>
            <p> La première chanson s'appelle {this.state.tracks[0].track.name}</p>
            <AlbumCover track={track1} />
          </div>
          <div className="App-buttons">
            {
              trackArray.map(item => (
                <Button children = {item.name} onClick = {() => this.checkAnswer(item, this.state.currentTrack.track)}/>
              ))
            }
          </div>
        </div>
      );
    }


  }
}

export default App;
