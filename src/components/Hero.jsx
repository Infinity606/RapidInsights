import React from "react";

import { logo } from "../assets";

const Hero = () => {
  return (
    <header className='w-full flex justify-center items-center flex-col'>
      <nav className='flex justify-between items-center w-full mb-10 pt-3'>
        <img src={logo} alt='sumz_logo' className='w-40 object-contain' />

        <button
          className='github-button'
          type='button'
          onClick={() =>
            window.open("https://github.com/Infinity606", "_blank")
          }
        >
        </button>
      </nav>

      <h1 className='head_text'>
        Article Summarizer <br className='max-md:hidden' />
        <span className='blue_gradient '>Using OpenAI GPT-4</span>
      </h1>
      <h2 className='desc'>
      Explore the future of efficient information consumption! Utilizing the latest advancements in artificial intelligence, 
      say goodby to lengthy articles and say hello to consise summaries.
      </h2>
    </header>
  );
};

export default Hero;
