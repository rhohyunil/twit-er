import React, { useState, useEffect } from "react";
import { dbService } from "fbase";
import Twit from "components/Twit";

const Home = ({ userObj }) => {
  const [twit, setTwit] = useState("");
  const [twits, setTwits] = useState([]);
  useEffect(() => {
    dbService.collection("twits").onSnapshot((snapshot) => {
      const twitArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTwits(twitArray);
    });
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection("twits").add({
      text: twit,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setTwit("");
  }
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTwit(value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={twit}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Twit" />
      </form>
      <div>
        {twits.map((twit) => (
          <Twit
            key={twit.id}
            twitObj={twit}
            isOwner={twit.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;