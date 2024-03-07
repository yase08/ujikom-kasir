import { Link } from "react-router-dom";
import Base from "../../Layouts/Base";

export default function Home() {
  return (
    <Base>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg)",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
            <p className="mb-5">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <Link className="btn btn-primary" href={"/login"}>
              Get Started
            </Link>
          </div>
        </div>
      </div>
      <div className="flex gap-5 px-10 flex-col bg-base-100 items-center pt-20 w-full">
        <div className="pb-5">
          <h1 className="text-2xl font-bold">Gallery</h1>
        </div>
        <div className="flex gap-10 flex-wrap">
          <Link to={`/gallery/shoes`}>
            <div className="card w-60 bg-base-100 shadow-xl">
              <figure>
                <img
                  src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                  alt="Shoes"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Shoes!</h2>
                <p>If a dog chews shoes whose shoes does he choose?</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </Base>
  );
}
