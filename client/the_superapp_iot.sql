-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 12, 2023 at 09:41 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `the_superapp_iot`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `email`, `fname`, `lname`, `created_at`) VALUES
(5, 'torntan.j@gmail.com', '12345', 'torntan.j@gmail.com', 'Thornthan', 'Jomtharak', '2023-03-01 10:52:50'),
(7, 'wiwsoos3', '12345', 'torntan.j@gmail.com', 'Thornthan', 'Jomtharak', '2023-03-10 03:26:57'),
(8, 'metros', '12345', 'adminmetros1@gmail.com', 'admin1', 'metros', '2023-03-10 03:27:23'),
(9, 'wiwsoos3', '12345', 'torntan.j@gmail.com', 'Thornthan', 'Jomtharak', '2023-03-10 04:22:20'),
(11, 'sansa', '$2b$10$mfv7JMlQi8Yd.CaZ3EH8d.rzU7aBUZidogHFwaXazEMER5ba9Fjw2', 'sansa.s@gmail.com', 'Sansa', 'Stark', '2023-03-11 04:56:15'),
(13, 'natpasan@matrosystems.co.th', '$2b$10$CkDjGT86Tgx.ayzFGVvSguR7zcmxIrGWPJhhsj9mx1vLPXKDzN0sW', 'natpasan@matrosystems.co.th', 'Natpa', 'San', '2023-03-11 07:23:02'),
(14, 'chanosin@metrosystems.co.th', '$2b$10$8UFq8hZn5uGP39uliIX4LOaKoar8nW35Z4oSSosqKdZv/7Btx25fq', 'chanosin@metrosystems.co.th', 'Chano', 'Sin', '2023-03-11 07:24:00');

-- --------------------------------------------------------

--
-- Table structure for table `qrcode`
--

CREATE TABLE `qrcode` (
  `qr_id` int(11) NOT NULL,
  `qr_token` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL COMMENT 'example Mr. Mrs. Ms.',
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `age` int(11) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `email` varchar(100) NOT NULL,
  `jobtitle` varchar(100) NOT NULL,
  `company` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `title`, `fname`, `lname`, `age`, `phone`, `email`, `jobtitle`, `company`, `description`, `token`, `created_at`) VALUES
(1, 'Mr.', 'James', 'Bond', 30, '0612345678', 'jamebond007@gmail.com', 'MI6 Agent', 'Military Intelligence, Section 6', 'The James Bond series focuses on a fictional British Secret Service agent created in 1953 by writer Ian Fleming, who featured him in twelve novels', '', '2023-03-09 03:18:56'),
(2, 'Mr.', 'Johny', 'English', 50, '0888888888', 'johnyenglish@gmail.com', 'MI5 Agent', 'Military Intelligence, Section 5', 'After a sudden attack on MI5, Johnny English, Britain\'s most confident, yet unintelligent spy, becomes Britain\'s only spy.', '', '2023-03-09 03:18:56'),
(3, 'Ms.', 'Jane', 'Froster', 34, '0999999999', 'janeforster@gmail.com', 'Actor', 'Marvel', 'Jane Froster AKA. Thor with cracked Mjornier', '', '2023-03-09 03:18:56'),
(4, 'Mr.', 'Eddard', 'Stark', 30, '0899999999', 'eddard.s@gmail.com', 'Lord of Winter Fell', 'Winter Fell', 'Eddard Stark is lord of Winterfell, an ancient fortress in the North of the fictional continent of Westeros. Though the character is established as the main character in the novel and the first season of the TV adaptation, a plot twist involving Ned at th', '', '2023-03-10 04:34:25'),
(8, 'Mr.', 'Arya', 'Stark', 30, '0811111111', 'arya.s@gmail.com', 'Winter Fell', 'Winter Fell', 'Eddard Stark is lord of Winterfell, an ancient fortress in the North of the fictional continent of Westeros. Though the character is established as the main character in the novel and the first season of the TV adaptation, a plot twist involving Ned at th', '', '2023-03-10 09:42:01'),
(11, 'Mr.', 'Sansa', 'Stark', 30, '0612345678', 'sansa.s@gmail.com', 'Queen of Winter Fell', 'Winter Fell', 'Queen Sansa Stark is the eldest daughter of Lord Eddard Stark and his wife, Lady Catelyn, sister of Robb, Arya, Bran, and Rickon Stark, and half-sister of Jon Snow; though truthfully is his cousin. Queen Sansa Stark is the eldest daughter of Lord Eddard S', '', '2023-03-10 10:13:10'),
(13, 'Mr.', 'Bran', 'Stark', 17, '0991237894', 'bran.s@gmail.com', 'King Bran I the Broken and Three-Eyed Raven', 'Winter Fell', 'King Bran I the Broken, born Brandon Stark and commonly known simply as \"Bran,\" is the fourth child and second son of Eddard and Catelyn Stark. Bran is a warg and a greenseer serving as the new Three-Eyed Raven. Eventually, he was crowned as the first ele', '', '2023-03-10 10:21:29'),
(14, 'Mr.', 'John', 'Snow', 24, '0841234568', 'john.s@gmail.com', 'Lord Commander of the Night\'s Watch', 'Night\'s Watch', 'Jon Snow, born Aegon Targaryen, is the son of Lyanna Stark and Rhaegar Targaryen, the late Prince of Dragonstone. From infancy, Jon is presented as the bastard son of Lord Eddard Stark, Lyanna\'s brother, and raised alongside Eddard\'s lawful children at Wi', '', '2023-03-10 10:24:40'),
(15, 'Mrs.', ' Daenerys', 'Targaryen', 23, '0994446667', 'denny.t@gmail.com', ' Princess of Dragonstone', 'House of Targaryen', 'I spent my life in foreign lands. So many men have tried to kill me, I don\'t remember all their names. I have been sold like a broodmare. I\'ve been chained and betrayed, raped and defiled. Do you know what kept me standing through all those years in exile', '', '2023-03-10 10:31:03'),
(16, 'Mr.', 'Viserys', 'Targaryen', 21, '0647894561', 'vissy.t@gmail.com', 'Prince of Dragonstone', 'House of Targaryen', 'Viserys Targaryen was the younger brother of the late Rhaegar Targaryen, the older brother of Daenerys Targaryen and the uncle of Jon Snow. Viserys and Daenerys were the remnants of the exiled House Targaryen following a rebellion against their father, Ae', '', '2023-03-10 10:35:30'),
(17, 'Mr.', 'Daemon', 'Targaryen', 51, '0647894561', 'daemon.t@gmail.com', 'Commander of the City Watch of King\'s Landing', 'House of Targaryen', 'King and council have long rued my position as next in line for the throne. But dream and pray as they all might, it seems I\'m not so easily replaced. Prince Daemon Targaryen[N 2] is a prince of the Targaryen dynasty, and the younger brother of King Viser', '', '2023-03-10 10:38:11'),
(18, 'Mr.', 'Otto', 'Hightower', 57, '0984561234', 'otto.h@gmail.com', 'Hand of the King', ' House Hightower', 'The gods have yet to make a man who lacks the patience for absolute power, Your Grace. Ser Otto Hightower is a knight of House Hightower and the Hand of the King to Kings Jaehaerys I, Viserys I, and Aegon II', '', '2023-03-10 10:50:32');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `qrcode`
--
ALTER TABLE `qrcode`
  ADD PRIMARY KEY (`qr_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `qrcode`
--
ALTER TABLE `qrcode`
  MODIFY `qr_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
