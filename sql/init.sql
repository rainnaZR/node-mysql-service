/*
 Navicat Premium Data Transfer

 Source Server         : feature1
 Source Server Type    : MySQL
 Source Server Version : 50670
 Source Host           : xxx
 Source Schema         : xxx

 Target Server Type    : MySQL
 Target Server Version : 50670
 File Encoding         : 65001

 Date: 01/07/2019 20:39:17
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for tbl_lb_page_city
-- ----------------------------
DROP TABLE IF EXISTS `tbl_lb_page_city`;
CREATE TABLE `tbl_lb_page_city` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `city_id` int(5) NOT NULL,
  `page_id` int(10) NOT NULL,
  `page_city_status` tinyint(4) DEFAULT '2' COMMENT '页面状态, 1:已发布，2:编辑中',
  `update_time` datetime DEFAULT NULL,
  `update_user` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `page_city_id` (`page_id`,`city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=346 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for tbl_lb_page
-- ----------------------------
DROP TABLE IF EXISTS `tbl_lb_page`;
CREATE TABLE `tbl_lb_page` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '页面id',
  `title` varchar(50) NOT NULL COMMENT '页面标题',
  `expire_time` datetime NOT NULL COMMENT '页面下线时间',
  `expire_link` varchar(255) DEFAULT NULL COMMENT '页面下线跳转链接',
  `bg_color` varchar(20) DEFAULT NULL COMMENT '页面背景色',
  `padding_bottom` int(50) DEFAULT NULL COMMENT '页面底部背景透出高度',
  `bg_image_url` varchar(255) DEFAULT NULL COMMENT '页面背景图',
  `create_user` varchar(40) DEFAULT NULL COMMENT '页面创建者',
  `create_time` datetime DEFAULT NULL COMMENT '页面创建时间',
  `update_user` varchar(40) DEFAULT NULL COMMENT '页面修改者',
  `update_time` datetime DEFAULT NULL COMMENT '页面最后修改时间',
  `share_content` varchar(255) DEFAULT NULL COMMENT '页面分享数据',
  `expire_delay_day` int(50) DEFAULT NULL COMMENT '页面过期延长时间',
  `city_list` varchar(255) DEFAULT NULL COMMENT '城市集合',
  `page_status` tinyint(2) NOT NULL DEFAULT '1' COMMENT '1: 正常，2: 失效',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for tbl_lb_page_module
-- ----------------------------
DROP TABLE IF EXISTS `tbl_lb_page_module`;
CREATE TABLE `tbl_lb_page_module` (
  `page_module_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `page_id` int(11) DEFAULT NULL,
  `business_data` text,
  `margin_top` int(10) DEFAULT NULL,
  `bg_color` varchar(255) DEFAULT NULL,
  `fence_data` varchar(255) DEFAULT NULL,
  `module_id` int(11) DEFAULT NULL,
  `page_module_title` varchar(255) DEFAULT NULL COMMENT '模块标题',
  `city_id` int(5) DEFAULT NULL,
  `page_module_order` int(20) DEFAULT NULL,
  `style_config_map` varchar(255) DEFAULT NULL,
  `data_config_map` varchar(255) DEFAULT NULL,
  `page_module_status` tinyint(4) DEFAULT '1' COMMENT '1: 正常，2: 失效',
  PRIMARY KEY (`page_module_id`),
  KEY `page_city_id` (`page_id`,`city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=320 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
