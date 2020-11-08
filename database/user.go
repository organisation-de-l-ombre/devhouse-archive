/*
 * User struct
 */

package database

import "gorm.io/gorm"

type User struct {
	gorm.Model
	UUID string
	Name string
}
