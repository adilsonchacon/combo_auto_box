require 'spec_helper'
require 'combo_auto_box/active_record'
require 'finders/activerecord_test_connector'

ActiverecordTestConnector.setup
abort unless ActiverecordTestConnector.able_to_connect

describe ComboAutoBox do
  describe "Activer record stuff" do
    extend ActiverecordTestConnector::FixtureSetup

    fixtures :people, :jobs

    context "on many multiple models" do
      it "initializes combo auto box correctly" do
        Person.combo_auto_box.should_not be_nil
        Person.combo_auto_box.each do |item|
          item.id.should_not be_nil
          item.label.should_not be_nil
        end

        Job.combo_auto_box.should_not be_nil
        Job.combo_auto_box.each do |item|
          item.id.should_not be_nil
          item.label.should_not be_nil
        end
      end

      it "should returns multiple items in order" do
        people = Person.combo_auto_box('a')
        people.size.should == 3
        people.first.label.should == 'Donna'
        people.second.label.should == 'Jackie'
        people.third.label.should == 'Michael'
      end

      it "should search by main term and by params" do
        job = Job.combo_auto_box('a', {salary: 1000})
        job.size.should == 1
        job.first.label.should == 'Programmer'
      end

    end
  end

end
