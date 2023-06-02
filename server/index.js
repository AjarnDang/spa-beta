const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const mysql2 = require('mysql2');
const app = express();
require('dotenv').config();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const bcrypt = require('bcrypt');
const saltRounds = 10;
var QRCode = require('qrcode');

var jwt = require('jsonwebtoken');
const secret = "TheSuperAppIoT-RegSystems"


// Cors คือ Cross Origin Resource Sharing เป็นกลไลที่ทำให้ Web Server 
// ให้อนุญาตหรือไม่อนุญาต ร้องขอทรัพยากรใดๆ ในหน้า Web ที่ถูกเรียกจาก Domain อื่น
// ที่ไม่ใช่ Domain ที่หน้า Web นั้นอยู่
app.use(express.json());
app.use(cors());

const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'the_superapp_iot'
});

app.get("/", (req, res) => {
    res.json("This is server-side. AKA Backend")
})

////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// Admin Section ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

//Fetch admin
app.get('/admin', (req, res) => {
    const q = "SELECT * FROM admin"
    db.query(q, (err, data) => {
        if (err) return res.status(500).json({
            "status": 500,
            "message": "Internal Server Error",
        })
        return res.json(data)
    });
});

//Fetch admin by ID
app.get('/admin/:id', (req, res) => {
    let id = req.params.id;
    db.query("SELECT * FROM admin WHERE id = ?", id, 
    (error, results, fields) => {
        if (error) throw error;
        let message = "";
        if (results === undefined || results.length == 0) {
            message = "admin not found"
        } else {
            message = "successfuly retrieved admin data"
        }
        return res.send({ error: false, data: results[0], message: message })
    })
})

//Creat admin
app.post('/regadmin', (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const q = "INSERT INTO admin (`username`,`password`,`fname`,`lname`,`email`) VALUES (?)"
        const values = [
            req.body.username,
            hash,
            req.body.fname,
            req.body.lname,
            req.body.email,
        ];
        db.query(q, [values], (err, data) => {
            if (err) return res.json(err)
            return res.json(data)
        })
    });
})

//Delete admin by ID
app.delete("/deleteadmin/:id", (req, res) => {
    const adminId = req.params.id;
    const q = "DELETE FROM admin WHERE id = ?";
    db.query(q, [adminId], (err, data) => {
        if (err) return res.json(err)
        return res.json("Admin has been deleted successfully")
    });
});

//Update admin
app.put("/updateadmin/:id", (req, res) => {
    const adminId = req.params.id;
    const q = "UPDATE admin SET `username` = ?, `password` = ?, `fname` = ?, `lname` = ?, `email` = ? WHERE id = ?";
    const values = [
        req.body.username,
        req.body.password,
        req.body.fname,
        req.body.lname,
        req.body.email,
    ];
    db.query(q, [...values, adminId], (err, data) => {
        if (err) return res.json(err)
        return res.json("Admin has been updated successfully")
    });
});

// Admin Routes Login
app.post('/login', jsonParser, function (req, res, next) {
    db.execute(
        'SELECT * FROM admin WHERE username = ?',
        [req.body.username,],
        function (err, admin, fields) {
            if (err) { res.json({ status: 'error', message: err }); return }
            if (admin.length == 0) { res.json({ status: 'error', message: 'no user found' }); return }
            bcrypt.compare(req.body.password, admin[0].password, function (err, isLogin) {
                if (isLogin) {
                    var token = jwt.sign({ email: admin[0].email }, secret);
                    res.json({ status: "ok", message: 'login success', token })
                } else {
                    res.json({ status: "error", message: 'login fail' })
                }
            });
        }
    );
});

// Authentication Admin
app.post('/auth', jsonParser, function(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        var decoded = jwt.verify(token, secret);
        res.json({ status: 'ok', decoded })
    } catch (err) {
        res.json({ status: 'err', message: err.message })
    }
});


////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// User Section ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

//Fetch users
app.get('/users', (req, res) => {
    const q = "SELECT * FROM users as us "
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    });
});

//Fetch users email
app.get('/useremail/:email', (req, res) => {
    let email = req.params.email;
    db.query("SELECT * FROM users WHERE email = ?", email,
        (err, results, fields) => {
            if (err) return res.json(err)
            let message = "";
            if (results === undefined || results.length == 0) {
                message = "email not found"
            } else {
                message = "successfuly retrieved email data"
            }
            return res.send({ error: false, data: results[0], message: message })
        })
});

//Add users
app.post('/useradd3', (req, res) => {
    const q = "INSERT INTO sub_users (`title`,`fname`,`lname`,`identityID`,`age`,`birthday`,`phone`,`email`,`jobtitle`,`company`,`description`) VALUES (?)"
    const values = [
        req.body.title,
        req.body.fname,
        req.body.lname,
        req.body.identityID,
        req.body.age,
        req.body.birthday,
        req.body.phone,
        req.body.email,
        req.body.jobtitle,
        req.body.company,
        req.body.description,
    ];
    db.query(q, [values], (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    })
})

// Test add user with QR
app.post('/useradd2', (req, res) => {
    const q = "INSERT INTO users (`title`,`fname`,`lname`,`identityID`,`age`,`birthday`,`phone`,`email`,`jobtitle`,`company`,`description`,`qrcode`) VALUES (?)"
    let title = req.body.title;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let identityID = req.body.identityID;
    let age = req.body.age;
    let birthday = req.body.birthday;
    let phone = req.body.phone;
    let email = req.body.email;
    let jobtitle = req.body.jobtitle;
    let company = req.body.company;
    let description = req.body.description;

    let values = [
        title,
        fname,
        lname,
        identityID,
        age,
        birthday,
        phone,
        email,
        jobtitle,
        company,
        description,
    ];
    QRCode.toDataURL("http://localhost:3000/confirmboothsignin/"+email, {
        width: 800,
        margin: 1,
        color: {
            dark: '#000000',
            light: '#ffffff'
        }
    }, (err, qrcode) => {
        if (err) {
            console.log(err)
        } else {
            values.push(qrcode);
            console.log(values);
            db.query(q, [values], (err, results) => {
                if (err) return res.json(err)
                let message = "";
                if (results === undefined || results.length == 0) {
                    message = "users not found"
                } else {
                    message = "successfuly inserted users data"
                }
                return res.send({ error: false, data: results[0], message: message })
            })
        }
    })
})

//User Booth Sign in
app.put('/user_booth_signin/:email', (req, res) => {
    const email = req.params.email;
    const q = "UPDATE users SET `status` = ?, `checked_in` = CURRENT_TIMESTAMP WHERE email = ?";
    
    const status = 1;

    db.query(q, [status, email], (err, data) => {
        if (err) return res.json(err)
        return res.json("Users has been signed in successfully")
    });
})

//User Booth Sign in
app.put('/user_booth_signout/:email', (req, res) => {
    const email = req.params.email;
    const q = "UPDATE users SET `status` = ?, `checked_out` = CURRENT_TIMESTAMP WHERE email = ?";
    
    const status = 2;

    db.query(q, [status, email], (err, data) => {
        if (err) return res.json(err)
        return res.json("Users has been signed out successfully")
    });
})

//Fetch user by ID
app.get('/users/:id', (req, res) => {
    let id = req.params.id;
    db.query("SELECT * FROM users WHERE id = ?", id, (error, results, fields) => {
        if (error) throw error;
        let message = "";
        if (results === undefined || results.length == 0) {
            message = "users not found"
        } else {
            message = "successfuly retrieved users data"
        }
        return res.send({ error: false, data: results[0], message: message })
    })
})

//Update user
app.put('/usersupdate/:id', (req, res) => {
    const userId = req.params.id;
    const q = "UPDATE users SET `title` = ?, `fname` = ?, `lname` = ?, `identityID` = ?, `age` = ?, `birthday` = ?, `phone` = ?, `email` = ?, `jobtitle` = ?,`company` = ?,`description` = ? WHERE id = ?";

    const values = [
        req.body.title,
        req.body.fname,
        req.body.lname,
        req.body.identityID,
        req.body.age,
        req.body.birthday,
        req.body.phone,
        req.body.email,
        req.body.jobtitle,
        req.body.company,
        req.body.description,
    ];
    db.query(q, [...values, userId], (err, data) => {
        if (err) return res.json(err)
        return res.json("Users has been updated successfully")
    });
})

//Delete user by ID
app.delete("/deleteuser/:id", (req, res) => {
    const userId = req.params.id;
    const q = "DELETE FROM users WHERE id = ?";

    db.query(q, [userId], (err, data) => {
        if (err) return res.json(err)
        return res.json("User has been deleted successfully")
    });
});

//QR Code
app.post('/qrcode', (req, res) => {
    let title = req.body.title;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let age = req.body.age;
    let phone = req.body.phone;
    let email = req.body.email;
    let jobtitle = req.body.jobtitle;
    let company = req.body.company;
    let description = req.body.description;

    console.log(req);
    if (!title || !fname || !lname || !phone || !email || !company || !phone || !jobtitle || !company) {
        console.log(res);
        return res.status(400).send({ error: true, message: "enter register" });
    } else {
        db.query('INSERT INTO users (title, fname, lname, age, phone, email, jobtitle, company, description) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [title, fname, lname, age, phone, email, jobtitle, company, description],
            (error, results, fields) => {
                if (error) throw error;
                return res.send({ error: false, data: results, message: "Successfully added" })
            })
    }
});

app.delete('/qrcode/del', (req, res) => {
    let fname = req.body.fname;

    if (!fname) {
        return res.status(400).send({ error: true, message: "Please provide names" });
    } else {
        db.query('DELETE FROM users WHERE fname = ?',
            [fname],
            (error, results, fields) => {
                if (error) throw error;
                
                let message = "";
                if (results.affectedRows === 0) {
                    message = "user not found";
                } else {
                    message = "user successfully deleted";
                }
                return res.send({ error: false, data: results, message: message })
            })
    }
})

//Count all user
app.get('/countallusers2', (req, res) => {
    db.query('SELECT COUNT(*) AS count FROM users',
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error retrieving data from database');
      } else {
        const count = results[0].count;
        res.status(200).send({ count }); // ส่งค่า count กลับมาในรูปแบบ Object
      }
    });
  });

//Count all user active
app.get('/countallusers_active', (req, res) => {
    db.query('SELECT COUNT(*) AS count FROM users WHERE status = 1',
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error retrieving data from database');
      } else {
        const count = results[0].count;
        res.status(200).send({ count }); // ส่งค่า count กลับมาในรูปแบบ Object
      }
    });
  });

//Count all user unactive
app.get('/countallusers_unactive', (req, res) => {
    db.query('SELECT COUNT(*) AS count FROM users WHERE status = 2',
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error retrieving data from database');
      } else {
        const count = results[0].count;
        res.status(200).send({ count }); // ส่งค่า count กลับมาในรูปแบบ Object
      }
    });
  });

//Count all user has QR code
app.get('/countallusers_hasqrcode', (req, res) => {
    db.query("SELECT COUNT(*) AS count FROM users WHERE qrcode != '' ",
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error retrieving data from database');
      } else {
        const count = results[0].count;
        res.status(200).send({ count }); // ส่งค่า count กลับมาในรูปแบบ Object
      }
    });
  });

//Count all user register today
app.get('/countallusers_regtoday', (req, res) => {
    const q = 'SELECT COUNT(*) AS count_reg FROM users WHERE DATE(created_at) = CURDATE()';
    db.query(q, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error retrieving data from database');
        } else {
            const count = results[0].count_reg;
            res.status(200).send({ count }); // ส่งค่า count กลับมาในรูปแบบ Object
        }
    });
});

//Count all user if male
app.get('/countallusers_mr', (req, res) => {
    const q = "SELECT COUNT(*) AS count_mr FROM users WHERE title = 'Mr.'";
    db.query(q, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error retrieving data from database');
        } else {
            const count = results[0].count_mr;
            res.status(200).send({ count }); // ส่งค่า count กลับมาในรูปแบบ Object
        }
    });
});

//Count all user if Female 1
app.get('/countallusers_ms', (req, res) => {
    const q = "SELECT COUNT(*) AS count_ms FROM users WHERE title = 'Ms.'";
    db.query(q, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error retrieving data from database');
        } else {
            const count = results[0].count_ms;
            res.status(200).send({ count }); // ส่งค่า count กลับมาในรูปแบบ Object
        }
    });
});

//Count all user if Female 2
app.get('/countallusers_mrs', (req, res) => {
    const q = "SELECT COUNT(*) AS count_mrs FROM users WHERE title = 'Mrs.'";
    db.query(q, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error retrieving data from database');
        } else {
            const count = results[0].count_mrs;
            res.status(200).send({ count }); // ส่งค่า count กลับมาในรูปแบบ Object
        }
    });
});

//Count Age
app.get('/countusers_age1', (req, res) => {
    const q = "SELECT COUNT(*) AS count_age FROM users WHERE age <= 19;";
    db.query(q, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error retrieving data from database');
        } else {
            const count = results[0].count_age;
            res.status(200).send({ count }); // ส่งค่า count กลับมาในรูปแบบ Object
        }
    });
});

//Count Age
app.get('/countusers_age2', (req, res) => {
    const q = "SELECT COUNT(*) AS count_age FROM users WHERE age >= 20 AND age <= 25;";
    db.query(q, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error retrieving data from database');
        } else {
            const count = results[0].count_age;
            res.status(200).send({ count }); // ส่งค่า count กลับมาในรูปแบบ Object
        }
    });
});
//Count Age
app.get('/countusers_age3', (req, res) => {
    const q = "SELECT COUNT(*) AS count_age FROM users WHERE age >= 26 AND age <= 30;";
    db.query(q, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error retrieving data from database');
        } else {
            const count = results[0].count_age;
            res.status(200).send({ count }); // ส่งค่า count กลับมาในรูปแบบ Object
        }
    });
});
//Count Age
app.get('/countusers_age4', (req, res) => {
    const q = "SELECT COUNT(*) AS count_age FROM users WHERE age >= 31 AND age <= 35;";
    db.query(q, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error retrieving data from database');
        } else {
            const count = results[0].count_age;
            res.status(200).send({ count }); // ส่งค่า count กลับมาในรูปแบบ Object
        }
    });
});

//Count Age
app.get('/countusers_age5', (req, res) => {
    const q = "SELECT COUNT(*) AS count_age FROM users WHERE age >= 36 AND age <= 40;";
    db.query(q, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error retrieving data from database');
        } else {
            const count = results[0].count_age;
            res.status(200).send({ count }); // ส่งค่า count กลับมาในรูปแบบ Object
        }
    });
});

//Count Age
app.get('/countusers_age6', (req, res) => {
    const q = "SELECT COUNT(*) AS count_age FROM users WHERE age >= 41;";
    db.query(q, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error retrieving data from database');
        } else {
            const count = results[0].count_age;
            res.status(200).send({ count }); // ส่งค่า count กลับมาในรูปแบบ Object
        }
    });
});

//Count Job
app.get('/getjobs', (req, res) => {
    const q = "SELECT jobtitle, COUNT(*) as job_count FROM users GROUP BY jobtitle"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    });
});

//Count Age
app.get('/getjobs', (req, res) => {
    const q = "SELECT COUNT(*) as u_count FROM users JOIN users ON users.id = sub_users.id WHERE sub_users.id = users.id"
    db.query(q, (err, data) => {
        if (err) return res.json(err)
        return res.json(data)
    });
});



////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// Other Backend ///////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////


app.get('/grade/:score', (req, res) => {
    const score = '81';
    let grade = '';
  
    if (score >= 0 && score < 50) {
      grade = 'E';
    } else if (score >= 50 && score < 60) {
      grade = 'D';
    } else if (score >= 60 && score < 70) {
      grade = 'C';
    } else if (score >= 70 && score < 80) {
      grade = 'B';
    } else if (score >= 80 && score <= 100) {
      grade = 'A';
    } else {
      return res.status(400).json({ error: 'Invalid score. Please enter a score between 0 and 100.' });
    }
  
    res.json({ grade: grade });
  });


  // API คำนวณอายุ
    app.get('/api/calculate-age/:userId', (req, res) => {
    const userId = req.params.userId;
  
    const sqlQuery = `SELECT birthday FROM users WHERE id = ${userId}`;
    db.query(sqlQuery, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'ไม่สามารถดึงข้อมูลวันเกิดได้' });
      } else {
        const dob = results[0].birthday;

        const age = calculateAge(dob);
        res.json({ age });
      }
    });
  });

  function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
  
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  }

 //Count Age 
app.get('/countusers_age7', (req, res) => {
    const q = "SELECT COUNT(*) AS user_count FROM users WHERE title = 'Mr.' AND DATEDIFF(CURDATE(), birthday) / 365 <= 20;";
    db.query(q, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error retrieving data from database');
        } else {
            const count = results[0].count_age;
            res.status(200).send({ count }); // ส่งค่า count กลับมาในรูปแบบ Object
        }
    });
}); 


//Count all user
app.get('/count_SubUsers', (req, res) => {
    db.query('SELECT COUNT(*) AS user_count FROM sub_users INNER JOIN users ON sub_users.id = users.id WHERE sub_users.usersID = users.id',
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error retrieving data from database');
      } else {
        const count = results[0].count;
        res.status(200).send({ count }); // ส่งค่า count กลับมาในรูปแบบ Object
      }
    });
  });

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// Port Section ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////


app.listen('3333', () => {
    console.log('Server is running on port 3333');
})

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////


