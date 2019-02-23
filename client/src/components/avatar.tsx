import React, { FC, useState } from 'react';
import Rest from '../lib/rest-service';

interface IAvatarProps {
  avatar: string;
  avatarUpdatedCallback?: Function;
  big?: boolean;
  editable?: boolean;
}

export const Avatar: FC<IAvatarProps> = ({ avatar, avatarUpdatedCallback, big, editable }) => {

  const [newAvatar, setNewAvatar] = useState(avatar);

  const edit = e => {
    let input = e.currentTarget.querySelector('input');
    if (input) {
      input.click();
    }
  };

  const processChange = e => {
    uploadFile(e.target.files[0]);
  };

  const uploadFile = (file) => {
    if (file.type.includes('image')) {
      let reader = new FileReader();
      reader.onload = () => {
        setNewAvatar(reader.result as string);
        Rest.put('avatar', { avatar: reader.result }).then(() => {
          if (avatarUpdatedCallback) {
            avatarUpdatedCallback(reader.result);
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragenter = e => {
    e.preventDefault();
  };

  const handleDragleave = e => {
    e.target.classList.remove('can-drop');
  };

  const handleDragover = e => {
    if ([...e.dataTransfer.types].includes('Files')) {
      e.preventDefault();
      e.target.classList.add('can-drop');
    }
  };

  const handleDrop = e => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

    let classes = 'avatar';
    if (big) {
      classes += ' big';
    }

    if (editable) {
      classes += ' editable';
      let avi = newAvatar || avatar;

      return (
        <div className={ classes }
          onClick={edit}
          onDragEnter={handleDragenter}
          onDragOver={handleDragover}
          onDragLeave={handleDragleave}
          onDrop={handleDrop}
          style={{
            backgroundImage: avi ? `url(${avi})` : `url(/images/default_avatar.png)`
          }}>
          <input type="file" value={newAvatar} onChange={processChange} />
          <div className="edit-overlay">
            <span>Click to change</span>
          </div>
        </div>
      );
    }

    return (
      <div className={ classes }
        style={{
          backgroundImage: avatar ? `url(${avatar})` : `url(/images/default_avatar.png)`
        }}
      ></div>
    );
};