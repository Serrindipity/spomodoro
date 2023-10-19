import React, { useState, useEffect } from 'react';
//import Slider from "./slider.js";
import ReactSlider from "react-slider";


const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

function WebPlayback(props) {
    const defaultVolume = 0.5;

    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);
    const [volume, setVolume] = useState(defaultVolume);

    const [sliderValue, setsliderValue] = useState(50);

    useEffect(() => {

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);
        console.log("Script created")

        window.onSpotifyWebPlaybackSDKReady = () => {
            console.log("SDK ready")

            const player = new window.Spotify.Player({
                name: 'Spomodoro Player',
                getOAuthToken: cb => { cb(props.token); },
                volume: volume
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', ( state => {

                if (!state) {
                    console.log("not state")
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then( state => { 
                    (!state)? setActive(false) : setActive(true)
                });

            }));

            player.connect();

            
        };
    }, []);

    // useEffect(() => {
    //     console.log('Volume changed:', volume);
    //     player.setVolume(volume / 100).then(() => {
    //         console.log('Volume updated!');
    //       });
    //   }, [volume]);

    if (!is_active) { 
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <b> Instance not active. Transfer your playback using your Spotify app </b>
                    </div>
                </div>
            </>)
    } else {
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">

                        <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

                        <div className="now-playing__side">
                            <div className="now-playing__name">{current_track.name}</div>
                            <div className="now-playing__artist">{current_track.artists[0].name}</div>

                            <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                                &lt;&lt;
                            </button>

                            <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                                { is_paused ? "PLAY" : "PAUSE" }
                            </button>

                            <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                                &gt;&gt;
                            </button>
                            <ReactSlider 
                            className="volumeSlider"
                            trackClassName="volumeSlider-track"
                            thumbClassName="volumeSlider-thumb"
                            defaultValue={defaultVolume}
                            min = {0}
                            max = {1}
                            step = {0.01}
                            //grab the current slider value and store it in a variable called volume
                            //when the slider value changes, update the volume variable
                            value = {volume}
                            onChange={(volume) => {setVolume(volume)
                                console.log('Volume changed:', volume);
                                player.setVolume(volume).then(() => {
                                console.log('Volume updated!');
                                });
                            }}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default WebPlayback
