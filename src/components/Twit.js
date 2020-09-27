import React, { useState } from "react";
import { dbService } from "fbase";

const Twit = ({ twitObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTwit, setNewTwit] = useState(twitObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this twit?");

    if (ok) {
      await dbService.doc(`twits/${twitObj.id}`).delete();
    }
  }
  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`twits/${twitObj.id}`).update({
      text: newTwit,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewTwit(value);
  };
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your twit"
              value={newTwit}
              required
              onChange={onChange}
              maxLength={120}
            />
            <input type="submit" value="Update Twit" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
          <>
            <h4>{twitObj.text}</h4>
            {isOwner && (
              <>
                <button onClick={onDeleteClick}>Delete Twit</button>
                <button onClick={toggleEditing}>Edit Twit</button>
              </>
            )}
          </>
        )}
    </div>
  );
};

export default Twit;