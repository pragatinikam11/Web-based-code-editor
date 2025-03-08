const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for changes in the code
  socket.on('code-change', (data) => {
    socket.broadcast.emit('code-change', data); // Send to all clients except the sender
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const socket = io('http://localhost:3000'); // Connect to the server

const Editor = () => {
  const [code, setCode] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Handle incoming code changes
    socket.on('code-change', (data) => {
      if (data.userId !== userId) {
        setCode(data.code);
      }
    });

    // Emit a code change event when user types
    const handleInputChange = (e) => {
      const newCode = e.target.value;
      setCode(newCode);
      socket.emit('code-change', { code: newCode, userId });
    };

    // Generate a unique userId (in a real scenario, you could assign a more permanent ID)
    const uniqueUserId = Math.random().toString(36).substring(2);
    setUserId(uniqueUserId);

    // Cleanup on component unmount
    return () => {
      socket.off('code-change');
    };
  }, [userId]);

  return (
    <div>
      <h2>Collaborative Code Editor</h2>
      <textarea
        value={code}
        onChange={(e) => handleInputChange(e)}
        style={{ width: '100%', height: '400px' }}
      />
      <SyntaxHighlighter language="javascript" style={docco}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default Editor;
import React from 'react';
import Editor from './Editor';

function App() {
  return (
    <div className="App">
      <Editor />
    </div>
  );
}

export default App;
<script src="https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.js"></script>
async function initializePyodide() {
    // Wait for Pyodide to load
    await loadPyodide();
    console.log("Pyodide loaded");
}

initializePyodide();
async function runPythonCode(code) {
    let pyodide = await loadPyodide();
    await pyodide.runPythonAsync(code);
}

runPythonCode("print('Hello, World!')");
<script src="https://cdn.jsdelivr.net/npm/emscripten@2.0.23/dist/emscripten.js"></script>
this.#include <stdio.h>

int main()
 {
    printf("Hello, World!");
    return 0;
}
<script src="https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.js"></script>
async function initializePyodide() {
    // Wait for Pyodide to load
    await loadPyodide();
    console.log("Pyodide loaded");
}

initializePyodide();
async function runPythonCode(code) {
    let pyodide = await loadPyodide();
    await pyodide.runPythonAsync(code);
}

runPythonCode("print('Hello, World!')");
<script src="https://cdn.jsdelivr.net/npm/emscripten@2.0.23/dist/emscripten.js"></script>
this.#include <stdio.h>
var Module = 
{
    onRuntimeInitialized: function ()
     {
        console.log("C code loaded");
        Module._main(); // Call the main function
    }
};
import React, { useState, useEffect } from "react";

const LanguageSelector = ({ onSelect }) => (
  <select onChange={onSelect}>
    <option value="python">Python</option>
    <option value="cpp">C/C++</option>
  </select>
);

const Editor = () => {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    if (language === "python") {
      initializePyodide();
    }
  }, [language]);

  const runCode = async () => {
    if (language === "python") {
      const result = await runPythonCode(code);
      setOutput(result);
    } else if (language === "cpp") {
      const result = await runCppCode(code);
      setOutput(result);
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  return (
    <div>
      <LanguageSelector onSelect={handleLanguageChange} />
      <textarea
        value={code}
        onChange={handleCodeChange}
        rows="10"
        cols="50"
        placeholder="Write your code here"
      />
      <button onClick={runCode}>Run</button>
      <div>Output: {output}</div>
    </div>
  );
};

export default Editor;
import React, { useState, useEffect } from "react";

const Editor = () => {
  const [htmlCode, setHtmlCode] = useState("<h1>Hello, World!</h1>");
  const [cssCode, setCssCode] = useState("h1 { color: red; }");
  const [jsCode, setJsCode] = useState("document.querySelector('h1').onclick = () => alert('Clicked!');");

  const [iframeKey, setIframeKey] = useState(0); // Used to force re-render iframe on code change

  // Function to update the iframe content
  const updatePreview = () => {
    const iframe = document.getElementById("preview-iframe");
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}</script>
        </body>
      </html>
    `);
    iframeDoc.close();
  };

  // Update the iframe whenever HTML, CSS, or JS code changes
  useEffect(() => {
    updatePreview();
  }, [htmlCode, cssCode, jsCode]);

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
      {/* Code Editors */}
      <div style={{ flex: 1 }}>
        <h3>HTML</h3>
        <textarea
          value={htmlCode}
          onChange={(e) => setHtmlCode(e.target.value)}
          style={{ width: "100%", height: "200px" }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <h3>CSS</h3>
        <textarea
          value={cssCode}
          onChange={(e) => setCssCode(e.target.value)}
          style={{ width: "100%", height: "200px" }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <h3>JavaScript</h3>
        <textarea
          value={jsCode}
          onChange={(e) => setJsCode(e.target.value)}
          style={{ width: "100%", height: "200px" }}
        />
      </div>

      {/* Live Preview */}
      <div style={{ flex: 1, height: "400px" }}>
        <h3>Live Preview</h3>
        <iframe
          id="preview-iframe"
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid #ccc",
          }}
          key={iframeKey}
        ></iframe>
      </div>
    </div>
  );
};

export default Editor;
const express = require('express');
const axios = require('axios');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('cookie-session');

const app = express();

// GitHub OAuth credentials
const GITHUB_CLIENT_ID = 'YOUR_CLIENT_ID';
const GITHUB_CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const CALLBACK_URL = 'http://localhost:3000/auth/github/callback'; // Change to your actual callback URL

passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
  // Store user info in session
  return done(null, { accessToken, profile });
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Set up session handling
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Redirect to GitHub login
app.get('/auth/github', passport.authenticate('github', { scope: ['repo'] }));

// Handle the callback from GitHub
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  });

// A route to display user data
app.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Hello ${req.user.profile.username}!`);
  } else {
    res.send('Please log in with GitHub first.');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
// Fetch the authenticated user's repositories
app.get('/repos', async (req, res) => {
    if (req.isAuthenticated()) {
      const { accessToken } = req.user;
  
      try {
        const response = await axios.get('https://api.github.com/user/repos', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        res.json(response.data);  // List of repositories
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch repositories.' });
      }
    } else {
      res.status(401).json({ error: 'Unauthorized.' });
    }
  });
  app.post('/create-gist', async (req, res) => {
    const { htmlCode, cssCode, jsCode, accessToken } = req.body;
  
    const gistData = {
      description: 'Collaborative Code Editor Gist',
      public: true,
      files: {
        'index.html': {
          content: htmlCode,
        },
        'style.css': {
          content: cssCode,
        },
        'script.js': {
          content: jsCode,
        },
      },
    };
  
    try {
      const response = await axios.post('https://api.github.com/gists', gistData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      res.json({ gistUrl: response.data.html_url });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create gist.' });
    }
  });
  app.post('/commit-code', async (req, res) => {
    const { htmlCode, cssCode, jsCode, accessToken, repoOwner, repoName } = req.body;
  
    // Get the latest commit to create a new one
    const getCommitResponse = await axios.get(
      `https://api.github.com/repos/${repoOwner}/${repoName}/git/refs/heads/main`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  
    const latestCommitSha = getCommitResponse.data.object.sha;
  
    // Create new commit
    const commitData = {
      message: 'Update code from collaborative editor',
      tree: [
        {
          path: 'index.html',
          mode: '100644',
          type: 'blob',
          content: htmlCode,
        },
        {
          path: 'style.css',
          mode: '100644',
          type: 'blob',
          content: cssCode,
        },
        {
          path: 'script.js',
          mode: '100644',
          type: 'blob',
          content: jsCode,
        },
      ],
      parents: [latestCommitSha],
    };
  
    try {
      const commitResponse = await axios.post(
        `https://api.github.com/repos/${repoOwner}/${repoName}/git/commits`,
        commitData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
  
      // Create reference (commit update)
      const updateRefResponse = await axios.patch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/git/refs/heads/main`,
        { sha: commitResponse.data.sha },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
  
      res.json({ success: true, commitUrl: `https://github.com/${repoOwner}/${repoName}/commit/${commitResponse.data.sha}` });
    } catch (error) {
      res.status(500).json({ error: 'Failed to commit code.' });
    }
  });
  import React, { useState, useEffect } from "react";
  import axios from "axios";
  
  const GitHubIntegration = () => {
    const [repos, setRepos] = useState([]);
    const [htmlCode, setHtmlCode] = useState("<h1>Hello</h1>");
    const [cssCode, setCssCode] = useState("h1 { color: red; }");
    const [jsCode, setJsCode] = useState("console.log('Hello World');");
    const [authenticated, setAuthenticated] = useState(false);
  
    useEffect(() => {
      axios.get('/repos')
        .then(response => {
          setRepos(response.data);
          setAuthenticated(true);
        })
        .catch(() => setAuthenticated(false));
    }, []);
  
    const handleCreateGist = () => {
      axios.post('/create-gist', { htmlCode, cssCode, jsCode })
        .then(response => {
          alert('Gist created: ' + response.data.gistUrl);
        })
        .catch(error => alert('Failed to create Gist.'));
    };
  
    const handleCommitCode = (repoOwner, repoName) => {
      axios.post('/commit-code', { htmlCode, cssCode, jsCode, repoOwner, repoName })
        .then(response => {
          alert('Code committed: ' + response.data.commitUrl);
        })
        .catch(error => alert('Failed to commit code.'));
    };
  
    if (!authenticated) {
      return <div>Please log in with GitHub to access your repositories.</div>;
    }
  
    return (
      <div>
        <h3>GitHub Repositories</h3>
        <ul>
          {repos.map(repo => (
            <li key={repo.id}>
              {repo.name}
              <button onClick={() => handleCommitCode(repo.owner.login, repo.name)}>Commit Code</button>
            </li>
          ))}
        </ul>
        <button onClick={handleCreateGist}>Create Gist</button>
      </div>
    );
  };
  
  export default GitHubIntegration;
  