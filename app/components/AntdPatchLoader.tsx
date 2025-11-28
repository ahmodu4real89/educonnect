"use client";
// client-side patch loader to ensure antd React-19 runtime patch runs on the browser
// this file only imports the patch as a side-effect and renders nothing
// keep it tiny to run as early as possible on client hydration
// @ts-ignore
import '@ant-design/v5-patch-for-react-19';

export default function AntdPatchLoader() {
  // no UI, just ensures the patch runs on the client
  return null;
}
