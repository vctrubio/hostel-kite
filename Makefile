# Makefile for Convex database seeding

.PHONY: seed-all seed-students seed-teachers seed-kites seed-bars seed-boards seed-packages clean

# Seed all tables
seed-all: seed-students seed-teachers seed-kites seed-bars seed-boards seed-packages

# Seed individual tables
seed-students:
	npx convex import seedings/seedStudents.jsonl --table students --append

seed-teachers:
	npx convex import seedings/seedTeachers.jsonl --table teachers --append

seed-equipment: seed-kites seed-bars seed-boards 

seed-kites:
	npx convex import seedings/seedKites.jsonl --table kites --append

seed-bars:
	npx convex import seedings/seedBars.jsonl --table bars --append

seed-boards:
	npx convex import seedings/seedBoards.jsonl --table boards --append

seed-packages:
	npx convex import seedings/seedPackages.jsonl --table packages --append

# Clean target (for future use - not needed now)
clean:
	@echo "Warning: No clean operation defined. Add table clearing logic if needed."