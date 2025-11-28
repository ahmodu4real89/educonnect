import { Avatar, Card } from "antd";
import Image from "next/image";
import { ReactNode } from "react";

const { Meta } = Card


function CourseCard({actions}:{actions: ReactNode[]}) {
  return (
    <Card
      style={{ width: 300 }}
      cover={
        <Image
          width={300}
          height={400}
          draggable={false}
          alt="example"
          src="https://picsum.photos/300/200?random=3"
        />
      }
      actions={actions}
    >
      <Meta
        avatar={<Avatar src="https://picsum.photos/300/200?random=3" />}
        title="Card title"
        description="This is the description"
      />
    </Card>
  )
}

export {CourseCard}