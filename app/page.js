'use client'
import './globals.css'
import Hero from './components/Hero/Hero'
import TopList from './components/TopList/Toplist';
import Potato from './components/Potato/Potato';
import OurServices from './components/OurServices/OurServices';
import Review from './components/Review/Review';
export default function Home() {
  return (
    <>
      <div className="HomePage">
        <Hero/>
        <TopList/>
        <Potato/>
        <OurServices/>
        <Review/>
      </div>
    </>
  );
}
