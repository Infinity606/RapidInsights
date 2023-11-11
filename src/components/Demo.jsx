import React, { useState, useEffect } from "react";

import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [isInputExpanded, setIsInputExpanded] = useState(false); //for expansion of input box
  const [isInputExpanded2, setIsInputExpanded2] = useState(false); //for enter button and link icon

  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  // RTK lazy query
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  // Load data from localStorage on mount
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );

    if (existingArticle) return setArticle(existingArticle);

    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      // update state and local storage
      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  // copy the url and toggle the icon for user feedback
  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  const handleInputClick = () => {
    setIsInputExpanded(true);
    setTimeout(() => {
      setIsInputExpanded2(true);
    }, 214);
  };

  const handleInputBlur = () => {
    // Set a timeout to shrink the input box after a brief delay
    setTimeout(() => {
      setIsInputExpanded(false);
      setIsInputExpanded2(false);
    }, 100); // Adjust the timeout duration as needed
  };

  const handleClearAll = () => {
    setAllArticles([]);
    localStorage.removeItem("articles"); // Clear articles from localStorage
  }

  useEffect(() => {
    // Clean up the timeout on component unmount
    return () => clearTimeout();
  }, []);

  return (
    <section className='mt-16 w-full max-w-xl'>
      {/* Search */}
      <div className='flex flex-col w-full gap-2'>
        <form
          className='relative flex justify-center items-center'
          onSubmit={handleSubmit}
        >
          {isInputExpanded2 && (
            <>
              <img
                src={linkIcon}
                alt='link-icon'
                className='absolute left-0 my-2 ml-3 w-5'
              />
              <button
                type='submit'
                className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700 '
              >
                <p>↵</p>
              </button>
            </>
          )}

          <input
            type='url'
            placeholder= {isInputExpanded ? '' : 'Paste article link here'}
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            onKeyDown={handleKeyDown}
            onBlur={handleInputBlur}
            required
            className={`url_input  ${isInputExpanded ? 'expanded' : ''} ${isInputExpanded ? 'left-align' : ''}`}// When you need to style an element based on the state of a sibling element, mark the sibling with the peer class, and use peer-* modifiers to style the target element     
            onClick={handleInputClick}
          />
        </form>

        {/* Browse History */}
        <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
          {allArticles.reverse().map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className='link_card'
            >
              <div className='copy_btn' onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt={copied === item.url ? "tick_icon" : "copy_icon"}
                  className='w-[40%] h-[40%] object-contain'
                />
              </div>
              <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>
                {item.url}
              </p>
            </div>
          ))}
        </div>
        {/* Clear All Button */}
        <button
            onClick={handleClearAll}
            className='clear_btn'
          >
            Clear All
          </button>
      </div>

      {/* Display Result */}
      <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching ? (
          <img src={loader} alt='loader' className='w-20 h-20 object-contain' />
        ) : error ? (
          <p className='font-inter font-bold text-black text-center'>
            Well, that wasn't supposed to happen...
            <br />
            <span className='font-satoshi font-normal text-gray-700'>
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className='flex flex-col gap-3'>
              <h2 className='font-satoshi font-bold text-gray-600 text-xl'>
                Article <span className='blue_gradient'>Summary</span>
              </h2>
              <div className='summary_box'>
                <p className='font-inter font-medium text-sm text-gray-700'>
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
