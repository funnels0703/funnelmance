const TitleBox = ({ mainmenu, submenu }) => {
  return (
    <div className="titleBox">
      <p>{mainmenu}</p>
      <p>{submenu}</p>
      <style jsx>{`
        .titleBox {
          width: 100%;
          padding-bottom: 16px;
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid #efefef;
          margin-bottom: 60px;
          p {
            color: #979797;
            font-size: 14px;
            font-weight: 400;
          }
        }
      `}</style>
    </div>
  );
};
export default TitleBox;
