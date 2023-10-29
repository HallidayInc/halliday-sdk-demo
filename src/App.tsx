import hallidayLogo from "./hallidayLogo.svg";
import Content from "./Content";

function App() {
  return (
    <div style={{
      textAlign: 'center',
      backgroundColor: '#282c34',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '26px',
      color: 'white',
    }}>
      <div style={{ marginBottom: "30px" }}>
        <img
          src={hallidayLogo}
          width="120px"
          alt="logo"
        />
        <p>Test Halliday SDK</p>
      </div>

      <Content />
    </div>
  );
}

export default App;