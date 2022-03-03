# Host: 127.0.0.1  (Version 8.0.28)
# Date: 2022-03-03 04:02:29
# Generator: MySQL-Front 6.0  (Build 2.20)


#
# Structure for table "osu_users"
#

DROP TABLE IF EXISTS `osu_users`;
CREATE TABLE `osu_users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `osu_user` varchar(255) DEFAULT NULL,
  `discord_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
