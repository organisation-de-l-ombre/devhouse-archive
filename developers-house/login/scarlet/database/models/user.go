/*
 * User struct
 */

package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	UUID string
	Name string
}
