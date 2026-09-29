import React, {
  useEffect,
  useRef,
  useState,
} from "react";


const DeferredRender = ({
  children,
  rootMargin = "500px",
  minHeight = 300,
}) => {

  const ref = useRef(null);

  const [visible, setVisible] =
    useState(false);


  useEffect(() => {

    if (visible) return;

    const element =
      ref.current;

    if (!element) return;


    if (
      !("IntersectionObserver" in window)
    ) {

      setVisible(true);

      return;
    }


    const observer =
      new IntersectionObserver(
        ([entry]) => {

          if (
            entry.isIntersecting
          ) {

            setVisible(true);

            observer.disconnect();

          }

        },
        {
          rootMargin,
        }
      );


    observer.observe(
      element
    );


    return () => {
      observer.disconnect();
    };

  }, [
    visible,
    rootMargin,
  ]);


  return (
    <div
      ref={ref}
      style={{
        minHeight:
          visible
            ? undefined
            : minHeight,
      }}
    >

      {visible
        ? children
        : null}

    </div>
  );
};


export default DeferredRender;