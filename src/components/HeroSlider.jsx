import React, { useEffect, useState } from "react";

const HeroSlider = ({authors}) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % authors.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-container flex flex-wrap w-full mx-[-15px] xl:mx-[-35px] lg:mx-[-20px] xl:!mt-0 items-center">
      <div className="hero-text flex w-12/12 md:!ml-[8.33333333%] lg:!ml-0 lg:w-5/12 xl:!ml-0 xl:w-5/12 w-full flex-[0_0_auto] !px-[15px] xl:!px-[35px] lg:!px-[20px] mt-[0px] lg:!mt-[50px] xl:!mt-0 max-w-full text-center lg:text-left xl:text-left">
        <h2 className="xl:!text-[3.2rem] !text-[calc(1.395rem_+_1.74vw)] !leading-[1.15] !mb-5 md:mx-[-1.25rem] lg:mx-0 !mt-7 relative">
          ¿Qué hubiese aprendido{" "}
          <span className="highlight xl:!text-[4.2rem] !text-[calc(1.395rem_+_1.74vw)] !leading-[1.15]">{authors[current].name}</span> en 
          <span id="top">top</span><span id="education">.education</span>?
        </h2>
      </div>
      <div className="hero-slider flex w-12/12">
        {authors.map((author, index) => {
          const position =
            index === current
              ? "center"
              : index === (current + 1) % authors.length
              ? "right"
              : index === (current - 1 + authors.length) % authors.length
              ? "left"
              : "hidden";
            return (
                <div key={index} className={`slide-wrapper ${position}`}>
                  <img
                    src={`/${author.image}`}
                    alt={author.name}
                    className={`slide ${position}`}
                  />
                  {position === "center" && (
                    <p className="author-description">{author.description}</p>
                  )}
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default HeroSlider;
