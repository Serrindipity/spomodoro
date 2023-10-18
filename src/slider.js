import ReactSlider from "react-slider";
import { useState } from "react";
    const Slider = () => {
        const [volume, setVolume] = useState(0);
      return (
        <ReactSlider 
        className="volumeSlider"
        trackClassName="volumeSlider-track"
        thumbClassName="volumeSlider-thumb"
        //grab the current slider value and store it in a variable called volume
        value={volume}
        //when the slider value changes, update the volume variable
        onChange={setVolume}
        />
      );
    };
    
    export default Slider;