import React, { useEffect, useRef } from 'react';
import { useThemeContext } from "../context/ThemeContext.js";
import { useParams, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import backgroundImage from '../assets/bg-main.png'; // Replace with the correct path

import { news } from '../data/news.js';
import title from '../assets/title.png';
import './BlogPost.css';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { useTreasureContext } from "../context/treasureContext.js";

const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL;

const parseContent = (content) => {
  const replacements = {
    '<b>': '<strong>', '</b>': '</strong>',
    '/n': '<br />',
    '/t': '&nbsp;',
    '<pre>': '<pre class="custom-preformatted">', '</pre>': '</pre>',
    '<ce>': '<div style="text-align: center;">', '</ce>': '</div>',
    '<u>': '<u>', '</u>': '</u>',
    '<i>': '<i>', '</i>': '</i>',
    '<ol>': '<ol>', '</ol>': '</ol>',
    '<ul>': '<ul>', '</ul>': '</ul>',
    '<li>': '<li>', '</li>': '</li>',
  };

  const linkRegex = /<link="([^"]*)">([^<]*)<\/link>/g;
  let links = [];
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    links.push({ match: match[0], url: match[1], text: match[2] });
  }

  for (const link of links) {
    content = content.replace(link.match, `@@LINK@@${links.indexOf(link)}@@`);
  }

  for (const [key, value] of Object.entries(replacements)) {
    content = content.split(key).join(value);
  }

  for (const link of links) {
    content = content.replace(`@@LINK@@${links.indexOf(link)}@@`, `<a href="${link.url}" class="custom-link" data-open-new-tab>${link.text}</a>`);
  }

  return content;
};

const fetchNews = async () => {
  return news;
};

const BlogPost = () => {
  const { theme } = useThemeContext();
  const { id } = useParams();
  const { pathname } = useLocation();
  const previousPathname = useRef(pathname);
  const { addTreasurePoint } = useTreasureContext();
  const pointAdded = useRef(false);
  const timerRef = useRef(null);

  const { data: newsData, error, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews
  });

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      console.log(`Pathname changed to: ${pathname}`);
      window.scrollTo(0, 0);
      previousPathname.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    const currentTime = new Date().getTime();
    sessionStorage.setItem('startTime', currentTime);
    console.log('Start time stored in session storage:', currentTime);

    const checkTimeOnPage = () => {
      if (!pointAdded.current) {
        const startTime = sessionStorage.getItem('startTime');
        const currentTime = new Date().getTime();
        const timeSpent = (currentTime - startTime) / 1000;
        console.log('Time spent on page:', timeSpent, 'seconds');
        if (timeSpent >= 60) {
          addTreasurePoint();
          pointAdded.current = true;
        }
      }
    };

    timerRef.current = setTimeout(checkTimeOnPage, 60000);

    return () => {
      clearTimeout(timerRef.current);
      checkTimeOnPage();
    };
  }, [addTreasurePoint]);

  useEffect(() => {
    // Dynamically add target="_blank" to all links with data-open-new-tab attribute
    document.querySelectorAll('a[data-open-new-tab]').forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }, [newsData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading news: {error.message}</div>;
  }

  const blog = newsData.find(blog => blog.id === id);

  if (!blog) {
    return <div>Blog post not found</div>;
  }

  const sanitizedContent = DOMPurify.sanitize(parseContent(blog.content));
  const sanitizedIntro = DOMPurify.sanitize(parseContent(blog.intro));
  const sanitizedConclusion = DOMPurify.sanitize(parseContent(blog.content_and_conclusion));

  const otherBlogs = newsData.filter(otherBlog => otherBlog.id !== id);

  return (
    <div
      className="main-app-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div className="main-content-container">
        <div
          className="blog-post-container"
        >
          <div className="title-container">
            {/*<img src={title} alt="Title" className="title-image" /> */}
            <h1 className="blog-post-title">{blog.title}</h1>
          </div>
          <br />
          <div className="flex-container">
            <img src={`${PUBLIC_URL}${blog.image}`} alt={blog.title} className="blog-post-image" />
            <div className="blog-post-intro">{parse(sanitizedIntro)}</div>
            <div className="blog-post-content">{parse(sanitizedContent)}</div>
            <img src={`${PUBLIC_URL}${blog.image2}`} alt={blog.title} className="blog-post-image2" />
            <div className="blog-post-content-and-conclusion">{parse(sanitizedConclusion)}</div>
            <div className="blog-post-meta">
              <span>{blog.time}</span>
              <span>{blog.views} views</span>
            </div>
            <div className="blog-post-interactions">
              <button className="blog-post-button">Like</button>
              <button className="blog-post-button">Comment</button>
            </div>

            <div className="recommendation-header">
              <h2>🔥 More News and Recommendations for You 🔥</h2>
            </div>

            <div className="recommendations">
              {otherBlogs.map((otherBlog) => (
                <div key={otherBlog.id} className="recommendation">
                  <Link to={`/blog/${otherBlog.id}`} onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    console.log(`Scrolled to top for blog id: ${otherBlog.id}`);
                  }}>
                    <img src={`${PUBLIC_URL}${otherBlog.image}`} alt={otherBlog.title} className="recommendation-image" />
                  </Link>
                  <Link to={`/blog/${otherBlog.id}`} onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    console.log(`Scrolled to top for blog id: ${otherBlog.id}`);
                  }} className="recommendation-title-link">
                    <h3 className="recommendation-title">{otherBlog.title}</h3>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
