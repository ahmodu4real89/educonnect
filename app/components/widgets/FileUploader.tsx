import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';

const { Dragger } = Upload;

const props: UploadProps = {
  name: 'file',
  beforeUpload: () => false,
  multiple: false,
  
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
  
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const FileUploader = (props : UploadProps) => (
  <Dragger {...props}>
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibited from uploading company data or other
      banned files.
    </p>
  </Dragger>
);

export default FileUploader;